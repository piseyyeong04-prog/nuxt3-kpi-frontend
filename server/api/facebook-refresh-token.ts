// server/api/facebook-refresh-token.ts
// Call this endpoint once after updating the short-lived token in .env
// It exchanges it → long-lived user token (60 days) → page token (NEVER expires)
// Then prints the permanent page token to copy back into .env

import { defineEventHandler, getQuery, createError } from 'h3';
import { useRuntimeConfig } from '#imports';
import { exchangeForLongLivedToken, getPageAccessToken } from '../utils/facebookTokenManager';

interface TokenDebugResult {
  page: string;
  step1_longLived: {
    token: string;
    expires_in_days: number;
    expires_at: string;
  };
  step2_pageToken: {
    token: string;
    note: string;
  };
  instructions: string;
}

export default defineEventHandler(async (event): Promise<TokenDebugResult> => {
  // Only allow in development
  const { page = 'HC' } = getQuery(event) as { page?: 'TC' | 'BC' | 'HC' };

  const config = useRuntimeConfig();

  const pageKey = page as 'TC' | 'BC' | 'HC';
  const pageConfig = config.facebook?.[pageKey] as
    | { appId?: string; appSecret?: string; pageId?: string; accessToken?: string }
    | undefined;

  if (!pageConfig?.appId || !pageConfig?.appSecret || !pageConfig?.accessToken || !pageConfig?.pageId) {
    throw createError({
      statusCode: 500,
      message: `Missing Facebook config for page: ${page}. Check your .env file.`,
    });
  }

  // Step 1: Exchange short-lived user token → long-lived user token (60 days)
  const longLivedResponse = await exchangeForLongLivedToken(
    pageConfig.appId,
    pageConfig.appSecret,
    pageConfig.accessToken
  );

  const expiresAt = new Date(Date.now() + longLivedResponse.expires_in * 1000);

  // Step 2: Exchange long-lived user token → Page access token (NEVER expires)
  const pageToken = await getPageAccessToken(pageConfig.pageId, longLivedResponse.access_token);

  console.log(`\n====== PERMANENT PAGE TOKEN FOR ${page} ======`);
  console.log(pageToken);
  console.log(`==============================================\n`);
  console.log(`Update your .env: FACEBOOK_ACCESS_TOKEN_${page}=${pageToken}`);

  return {
    page,
    step1_longLived: {
      token: longLivedResponse.access_token.substring(0, 20) + '...',  // masked for safety
      expires_in_days: Math.round(longLivedResponse.expires_in / 86400),
      expires_at: expiresAt.toISOString(),
    },
    step2_pageToken: {
      token: pageToken,  // full token — copy this to .env!
      note: 'This is a Page Access Token generated from a long-lived user token. It NEVER expires.',
    },
    instructions: `Copy step2_pageToken.token and set FACEBOOK_ACCESS_TOKEN_${page}=<token> in your .env file`,
  };
});
