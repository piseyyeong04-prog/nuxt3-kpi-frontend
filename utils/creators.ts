// utils/creators.ts

export interface IRemark {
  id: number;
  status: string;
  title: string;
  video_link: string;
  view: string | null;
  creators: number;
  date_created: string;
  big_video: string;
}

export interface ICreator {
  department: any;
  id: number;
  status: string;
  staff: string;
  target: string;
  remarks: IRemark[]; 
  user_created: {
    department_id: any;
    id: string;
    first_name: string;
    last_name: string;
    department: 
    {
      id: any;
      title: string;
    };
    title: string | null;
    
  };
  note?: string;
}

/**
 * Calculate total views from a list of remarks
 * @param remarks List of remarks containing view data
 * @returns Total views as a string
 */
// export const getTotalViews = (remarks: IRemark[]): string => {
//   if (!remarks || remarks.length === 0) return '0';

//   let total = 0;
//   remarks.forEach(remark => {
//     if (remark.view) {
//       total += parseInt(remark.view);
//     }
//   });

//   return total.toString();
// };
export const getTotalViews = (remarks: IRemark[]): string => {
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
export const isCompleted = (creator: ICreator): boolean => {
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
export const calculatePercent = (creator: ICreator): number => {
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
export const getPercentClass = (percent: number) => {
  if (percent >= 100) return 'text-green-600 font-bold';
  if (percent >= 75) return 'text-blue-600 font-bold';
  return 'text-pink-600 font-bold';
};

/**
 * Get the appropriate CSS class for progress bar
 * @param percent Percentage value
 * @returns CSS class string
 */
export const getProgressBarColor = (percent: number) => {
  if (percent >= 100) return 'bg-green-600';
  if (percent >= 75) return 'bg-blue-600';
  return 'bg-pink-600';
};

/**
 * Calculate the total number of completed targets
 * @param creators List of creators
 * @returns Number of completed targets
 */
export const getCompletedTargetsCount = (creators: ICreator[]): number => {
  return creators.filter(isCompleted).length;
};

/**
 * Calculate the total number of active creators
 * @param creators List of creators
 * @returns Number of active creators
 */
export const getActiveCreatorsCount = (creators: ICreator[]): number => {
  return creators.filter(creator => creator.status === 'active').length;
};

/**
 * Calculate the total views across all creators
 * @param creators List of creators
 * @returns Total views formatted string
 */
export const getTotalViewsAcrossAll = (creators: ICreator[]): string => {
  let totalViews = 0;
  creators.forEach(creator => {
    totalViews += parseInt(getTotalViews(creator.remarks) || '0');
  });
  return totalViews.toString();
};

/**
 * Calculate the total number of videos
 * @param creators List of creators
 * @returns Total number of videos
 */
export const getTotalVideosCount = (creators: ICreator[]): number => {
  return creators.reduce((total, creator) => total + (creator.remarks?.length || 0), 0);
};
export const filterRemarksByKpiRange = (remarks: IRemark[]): IRemark[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const start = new Date(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1, 23);
  const end = new Date(currentYear, currentMonth, 11, 23, 59, 59);

  return remarks.filter(r => {
    const created = new Date(r.date_created);
    return created >= start && created <= end;
  });
};
export const filterRemarksByCustomRange = (remarks: IRemark[], start: Date, end: Date): IRemark[] => {
  return remarks.filter(r => {
    const created = new Date(r.date_created);
    return created >= start && created <= end;
  });
};

import { ref, computed } from 'vue';

const creators = ref<ICreator[]>([]);

export const creatorsList = computed(() => {
  return creators.value;
});

export const getKpiPeriodsFromCreators = (items: { date_created: string }[]) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const map: Record<string, { label: string; from: Date; to: Date }> = {}

  for (const { date_created } of items) {
    const date = new Date(date_created)
    let y = date.getFullYear()
    let m = date.getMonth()

    // Adjust to previous month if the day is before 24
    if (date.getDate() < 24) {
      m -= 1
      if (m < 0) {
        m = 11
        y -= 1
      }
    }

    const key = `${y}-${String(m + 1).padStart(2, '0')}`
    if (!map[key]) {
      const from = new Date(y, m, 24)                   // 24th of current month
      const to = new Date(y, m + 1, 24)                 // 24th of next month (not inclusive)
      const label = `${monthNames[m]} ${y} (24 ${monthNames[m]} - 23 ${monthNames[(m + 1) % 12]})`

      map[key] = { label, from, to }
    }
  }

  return map
}


export const getSortedKpiPeriodsFromCreators = (items: { date_created: string }[]) => {
  const periodMap = getKpiPeriodsFromCreators(items);
  return Object.entries(periodMap)
    .sort(([a], [b]) => a.localeCompare(b)) // sort by 'YYYY-MM'
    .map(([key, value]) => ({ key, ...value }));
};

export const countBigVideos = (remarks: IRemark[] = []) => {
  return remarks.filter(r => r.big_video === 'yes').length;
};

export const getBigVideoViews = (remarks: IRemark[] = []) => {
  return remarks
    .filter(r => r.big_video === 'yes' && r.view)
    .reduce((sum, r) => sum + parseInt(r.view || '0'), 0)
    .toString();
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
