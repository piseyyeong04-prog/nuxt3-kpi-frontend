// server/api/facebook-engagement.ts
import { defineEventHandler, getQuery, createError } from 'h3';
import { useRuntimeConfig } from '#imports';

interface ReactionItem {
  id?: string;
  type?: string;
}

interface ReactionsResponse {
  data?: ReactionItem[];
  summary?: { total_count?: number };
}

interface EdgeSummaryResponse {
  data?: unknown[];
  summary?: { total_count?: number };
}

interface CoreResponse {
  id?: string;
  name?: string;
  message?: string;
  created_time?: string;
  page_story_id?: string;   // The post/story ID that owns the reactions
}

interface InsightItem {
  name?: string;
  values?: { value?: number }[];
}

interface InsightsResponse {
  data?: InsightItem[];
}

interface EngagementResult {
  id: string;
  message: string;
  created_time: string;
  clicks: number;  // post_clicks — total clicks on the post (available without App Review)
  reactions: {
    total: number;
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  comments: number;
  shares: number;
}

// Returns null on any error (permission denied, missing field, etc.)
async function safeEdge<T>(url: string, params: Record<string, string>): Promise<T | null> {
  try {
    return await $fetch<T>(url, { params });
  } catch {
    return null;
  }
}

export default defineEventHandler(async (event): Promise<EngagementResult> => {
  const { objectId, page = 'TC' } = getQuery(event) as {
    objectId?: string;
    page?: 'TC' | 'BC' | 'HC';
  };

  const config = useRuntimeConfig();

  if (!objectId) {
    throw createError({ statusCode: 400, message: 'Object ID is required' });
  }

  const pageConfig = config.facebook?.[page as 'TC' | 'BC' | 'HC'] as
    | { accessToken?: string }
    | undefined;

  if (!pageConfig?.accessToken) {
    throw createError({
      statusCode: 500,
      message: `Facebook access token not configured for page: ${page}`,
    });
  }

  const token: string = pageConfig.accessToken;
  const base = `https://graph.facebook.com/v22.0/${objectId}`;

  // ── Step 1: Core identity + page_story_id ──
  // page_story_id is the post/story that OWNS the reactions for this photo object.
  // Reactions on photo objects often fail with (#100); reactions on the story always work.
  const core = await safeEdge<CoreResponse>(base, {
    fields: 'id,name,created_time,page_story_id',
    access_token: token,
  });

  if (!core?.id) {
    throw createError({
      statusCode: 403,
      message: `Cannot access object ${objectId}. Make sure you selected the correct Facebook Page.`,
    });
  }

  // Use the story/post ID for reaction queries if available; otherwise fall back to objectId
  const reactionBase = core.page_story_id
    ? `https://graph.facebook.com/v22.0/${core.page_story_id}`
    : base;

  const reactionTypes = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'] as const;

  // ── Step 2: Fetch everything in parallel ──
  const [
    reactionsSummary,       // Total count from reactions edge (summary only)
    commentsData,
    sharesData,
    insightsData,
    ...perTypeRaw
  ] = await Promise.all([
    // Reactions summary total (limit=0 → summary only, no individual items needed)
    safeEdge<ReactionsResponse>(`${reactionBase}/reactions`, {
      summary: 'true',
      limit: '0',
      access_token: token,
    }),
    // Comments count
    safeEdge<EdgeSummaryResponse>(`${base}/comments`, {
      summary: 'true',
      filter: 'stream',
      limit: '0',
      access_token: token,
    }),
    // Shares (fetch actual list to count them)
    safeEdge<EdgeSummaryResponse>(`${base}/sharedposts`, {
      limit: '200',
      access_token: token,
    }),
    // Clicks via Page Post Insights (post_clicks works without App Review)
    safeEdge<InsightsResponse>(`${reactionBase}/insights`, {
      metric: 'post_clicks',
      period: 'lifetime',
      access_token: token,
    }),
    // Per-type reaction counts (on the story/post, not the photo object)
    ...reactionTypes.map((type) =>
      safeEdge<ReactionsResponse>(`${reactionBase}/reactions`, {
        type,
        summary: 'true',
        limit: '0',
        access_token: token,
      })
    ),
  ]);

  // ── Parse per-type reactions ──
  const perTypeFetches = perTypeRaw as (ReactionsResponse | null)[];
  const counts: Record<string, number> = {};
  reactionTypes.forEach((type, i) => {
    counts[type.toLowerCase()] = perTypeFetches[i]?.summary?.total_count ?? 0;
  });

  const likeCount  = counts['like']  ?? 0;
  const loveCount  = counts['love']  ?? 0;
  const hahaCount  = counts['haha']  ?? 0;
  const wowCount   = counts['wow']   ?? 0;
  const sadCount   = counts['sad']   ?? 0;
  const angryCount = counts['angry'] ?? 0;

  // Sum of per-type is most accurate; fall back to summary if all are 0
  const perTypeSum = likeCount + loveCount + hahaCount + wowCount + sadCount + angryCount;
  const summaryTotal = reactionsSummary?.summary?.total_count ?? 0;
  const totalReactions = perTypeSum > 0 ? perTypeSum : summaryTotal;

  const totalComments = commentsData?.summary?.total_count ?? 0;
  const totalShares   = (sharesData?.data as unknown[])?.length ?? 0;

  // ── Clicks from Page Post Insights ──
  let totalClicks = 0;
  if (insightsData?.data) {
    for (const item of insightsData.data) {
      if (item.name === 'post_clicks') totalClicks = item.values?.[0]?.value ?? 0;
    }
  }

  return {
    id: core.id ?? objectId,
    message: core.name ?? core.message ?? '',
    created_time: core.created_time ?? '',
    clicks: totalClicks,
    reactions: {
      total: totalReactions,
      like:  likeCount,
      love:  loveCount,
      haha:  hahaCount,
      wow:   wowCount,
      sad:   sadCount,
      angry: angryCount,
    },
    comments: totalComments,
    shares:   totalShares,
  };
});
