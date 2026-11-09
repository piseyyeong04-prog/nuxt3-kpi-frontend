// utils/editors.ts

export interface IRemark {
  id: number;
  date_created: Date;
  status: string;
  facebook_link: string;  
  view: string | null;
  editors: number;
}

export interface IEditor {
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
    avatar?: string; // Optional avatar URL
  };
   content_creator?: {
    staff?: {
      first_name?: string;
      last_name?: string;
    };
    target?: string;
    remarks?: {
      view?: string;
      video_link?: string;
    }[];
  };
  note?: string;
}


/**
 * Calculate total views from a list of remarks
 * @param remarks List of remarks containing view data
 * @returns Total views as a string
 */
export const getEditorTotalViews = (remarks: IRemark[] | undefined): string => {
  if (!remarks || remarks.length === 0) return '0';

  let total = 0;
  remarks.forEach(remark => {
    if (remark.view) {
      total += parseInt(remark.view);
    }
  });

  return total.toString();
};

/**
 * Check if a creator has completed their target
 * @param creator Creator object with target and remarks
 * @returns boolean indicating if target is completed
 */
export const isEditorCompleted = (creator: IEditor): boolean => {
  const kpiRemarks = filterRemarksByKpiMonth(creator.remarks || []);
  const target = parseInt(creator.target || '0');
  return kpiRemarks.length >= target;
};
/**
 * Calculate percentage of target achieved
 * @param creator Creator object with target and remarks
 * @returns Percentage as a number
 */
export const calculatePercent = (creator: IEditor): number => {
  const kpiRemarks = filterRemarksByKpiMonth(creator.remarks || []);
  const totalArticles = kpiRemarks.length;
  const target = parseInt(creator.target || '0');
  if (target === 0) return 0;
  return Math.min(Math.round((totalArticles / target) * 100), 100);
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
 * @param editors List of editors
 * @returns Number of completed targets
 */
export const getCompletedTargetsCount = (editors: IEditor[]): number => {
  if (!editors || editors.length === 0) return 0;
  return editors.filter(creator => {
    const kpiRemarks = filterRemarksByKpiMonth(creator.remarks || []);
    const target = parseInt(creator.target || '0');
    return kpiRemarks.length >= target;
  }).length;
};

/**
 * Calculate the total number of articles across all editors
 * @param editors List of editors
 * @returns Total count of articles
 */
export const getTotalArticlesCount = (editors: IEditor[]): number => {
  if (!editors || editors.length === 0) return 0;
  return editors.reduce((total, creator) => {
    const kpiRemarks = filterRemarksByKpiMonth(creator.remarks || []);
    return total + kpiRemarks.length;
  }, 0);
};
/**
 * Calculate the total views across all editors
 * @param editors List of editors
 * @returns Total views as a string
 */
export const getTotalViewsAcrossAll = (editors: IEditor[]): string => {
  if (!editors || editors.length === 0) return '0';
  
  let totalViews = 0;
  editors.forEach(creator => {
    totalViews += parseInt
          (getEditorTotalViews(creator.remarks) || '0');
  });
  return totalViews.toString();
};

export const getKpiPeriodsFromEditors = (articles: { date_created: string }[]) => {
 const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const periodMap: Record<string, { label: string, from: Date, to: Date }> = {};

  for (const article of articles) {
    const created = new Date(article.date_created);
    const year = created.getFullYear();
    const month = created.getMonth();

    let periodYear = year;
    let periodMonth = month;

    if (created.getDate() < 23) {
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


export const filterRemarksByKpiMonth = (
  remarks: IRemark[],
  referenceDate: Date = new Date()
): IRemark[] => {
  const ref = new Date(referenceDate)
  const day = ref.getDate()
  let year = ref.getFullYear()
  let month = ref.getMonth()

  // ✅ Now includes the 23rd in the current month instead of previous
  if (day < 24) {
    month -= 1
    if (month < 0) {
      month = 11
      year -= 1
    }
  }

  const start = new Date(Date.UTC(year, month, 24))             // Start from the 24th
  const end = new Date(Date.UTC(year, month + 1, 23, 23, 59, 59)) // Until next 24th at 23:59:59

  return remarks.filter(r => {
    const created = new Date(r.date_created)
    return created >= start && created <= end
  });
};


