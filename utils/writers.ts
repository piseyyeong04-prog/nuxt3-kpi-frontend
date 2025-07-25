// utils/writers.ts

export interface IRemark {
  id: number;
  status: string;
  title: string;
  article_link: string;  // Changed from video_link to article_link
  view: string | null;
  creators: number;
  date_created: Date;
  impact_article: string;

}

export interface IWriter {
  id: number;
  status: string;
  staff: string;
  target: string;
  remarks: IRemark[];
  user_created: {
    id: string;
    first_name: string;
    last_name: string;
    department: {
      title: string;
    } | null;
    title: string | null;
  };
  note?: string;
}

/**
 * Calculate total views from a list of remarks
 * @param remarks List of remarks containing view data
 * @returns Total views as a string
 */
export const getTotalViews = (remarks: IRemark[] | undefined): string => {
  if (!remarks || remarks.length === 0) return '0';

  let total = 0;
  remarks.forEach(remark => {
    if (remark.view) {
      total += parseInt(remark.view);
    }
  });

  return total.toString();
};
// get total number of  article_link 
export const getTotaFacebookLink = (remarks: IRemark[] | undefined): string => {
  if (!remarks || remarks.length === 0) return '0';

  let total = 0;
  remarks.forEach(remark => {
    if (remark.article_link) {
      total += parseInt(remark.article_link);
    }
  });

  return total.toString();
};

/**
 * Check if a creator has completed their target
 * @param creator Creator object with target and remarks
 * @returns boolean indicating if target is completed
 */
export const isCompleted = (creator: IWriter): boolean => {
  if (creator.status === 'completed') return true;

  const totalViews = parseInt(getTotalViews(creator.remarks) || '0');
  const target = parseInt(creator.target || '0');

  return totalViews >= target;
};

/**
 * Calculate percentage of target achieved
 * @param creator Creator object with target and remarks
 * @returns Percentage as a number
 */
export const calculatePercent = (creator: IWriter): number => {
  const totalViews = parseInt(getTotalViews(creator.remarks) || '0');
  const target = parseInt(creator.target || '0');

  if (target === 0) return 0;
  return Math.round((totalViews / target) * 100);
};

/**
 * Get the appropriate CSS class for percentage display
 * @param percent Percentage value
 * @returns CSS class string
 */
export const getPercentClass = (percent: number): string => {
  if (percent >= 100) return 'text-green-600 font-bold';
  if (percent >= 75) return 'text-blue-600 font-bold';
  return 'text-pink-600 font-bold';
};

/**
 * Get the appropriate CSS class for progress bar
 * @param percent Percentage value
 * @returns CSS class string
 */
export const getProgressBarColor = (percent: number): string => {
  if (percent >= 100) return 'bg-green-600';
  if (percent >= 75) return 'bg-blue-600';
  return 'bg-pink-600';
};

/**
 * Calculate the total number of completed targets
 * @param creators List of creators
 * @returns Number of completed targets
 */
export const getCompletedTargetsCount = (creators: IWriter[]): number => {
  if (!creators || creators.length === 0) return 0;
  return creators.filter(isCompleted).length;
};

/**
 * Calculate the total number of articles across all creators
 * @param creators List of creators
 * @returns Total count of articles
 */
export const getTotalArticlesCount = (creators: IWriter[]): number => {
  if (!creators || creators.length === 0) return 0;

  return creators.reduce((total, creator) => {
    return total + (creator.remarks?.length || 0);
  }, 0);
};

/**
 * Calculate the total views across all creators
 * @param creators List of creators
 * @returns Total views as a string
 */
export const getTotalViewsAcrossAll = (creators: IWriter[]): string => {
  if (!creators || creators.length === 0) return '0';

  let totalViews = 0;
  creators.forEach(creator => {
    totalViews += parseInt(getTotalViews(creator.remarks) || '0');
  });
  return totalViews.toString();
};
export const getTotalArticlesCountInCurrentPeriod = (creators: IWriter[], period: { from: Date; to: Date } | null): number => {
  if (!period) return 0;
  return creators.reduce((total, creator) => {
    const count = (creator.remarks || []).filter(article => {
      const date = new Date(article.date_created);
      return date >= period.from && date < period.to;
    }).length;
    return total + count;
  }, 0);
};

export const getTotalViewsAcrossAllInCurrentPeriod = (creators: IWriter[], period: { from: Date; to: Date } | null): string => {
  if (!period) return '0';
  let totalViews = 0;
  creators.forEach(creator => {
    const views = (creator.remarks || []).filter(article => {
      const date = new Date(article.date_created);
      return date >= period.from && date < period.to;
    }).reduce((sum, article) => sum + (parseInt(article.view || '0')), 0);
    totalViews += views;
  });
  return totalViews.toString();
};

export const getCompletedTargetsCountInCurrentPeriod = (creators: IWriter[], period: { from: Date; to: Date } | null): number => {
  if (!period) return 0;
  return creators.filter(creator => {
    const remarksInPeriod = (creator.remarks || []).filter(article => {
      const date = new Date(article.date_created);
      return date >= period.from && date < period.to;
    });
    const views = remarksInPeriod.reduce((sum, r) => sum + (parseInt(r.view || '0')), 0);
    const target = parseInt(creator.target || '0');
    return views >= target;
  }).length;
};

/**
 * Generate KPI period ranges (23rd of month to 23rd of next) from article dates.
 * @param articles List of articles with date_created
 * @returns Object with keys like '2025-05' and value containing label, from, to
 */

export const getKpiPeriodsFromArticles = (articles: { date_created: string }[]) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const periodMap: Record<string, { label: string, from: Date, to: Date }> = {};

  for (const article of articles) {
    const created = new Date(article.date_created);
    const year = created.getFullYear();
    const month = created.getMonth();

    let periodYear = year;
    let periodMonth = month;

    if (created.getDate() < 24) {
      periodMonth = month - 1;
      if (periodMonth < 0) {
        periodMonth = 11;
        periodYear = year - 1;
      }
    }

    const periodKey = `${periodYear}-${String(periodMonth + 1).padStart(2, '0')}`;

    const fromDate = new Date(periodYear, periodMonth, 24);
    const toDate = new Date(periodYear, periodMonth + 1, 24);

    periodMap[periodKey] = {
      label: `${monthNames[periodMonth]} ${periodYear} (24 ${monthNames[periodMonth].substring(0, 3)} - 23 ${monthNames[(periodMonth + 1) % 12].substring(0, 3)})`,
      from: fromDate,
      to: toDate
    };
  }

  return periodMap;
};
