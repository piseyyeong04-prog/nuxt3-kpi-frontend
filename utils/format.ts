// utils/format.ts

/**
 * Formats a date string for display
 * @param dateString Date string to format
 * @returns Formatted date string (e.g., "May 12, 2025")
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats large numbers with abbreviations (K, M)
 * @param num Number string to format
 * @returns Formatted number string with appropriate suffix
 */
export const formatNumber = (num: string | null): string => {
  if (!num) return '0';
  const value = parseInt(num);
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toLocaleString();
};

/**
 * Formats total views for display with decimal precision
 * @param views Views string to format
 * @returns Formatted views string with appropriate suffix
 */
export const formatTotalViews = (views: string): string => {
  const viewsNum = parseInt(views);
  if (viewsNum >= 1000000) {
    return (viewsNum / 1000000).toFixed(2) + 'M';
  } else if (viewsNum >= 1000) {
    return (viewsNum / 1000).toFixed(1) + 'K';
  }
  return viewsNum.toLocaleString();
};

/**
 * Get KPI date headers for the current period
 * @returns Object containing dateRangeHeader and totalViewsHeader
 */
/**
 * Get KPI date headers for the current period using 24th as the cut-off.
 * @returns Object containing dateRangeHeader, totalViewsHeader, monthLabel
 */
export const getKpiDateHeaders = () => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  const day = now.getDate();

  // Use 24th as cutoff: if day < 24, we consider previous month's KPI
  if (day < 24) {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }

  const from = new Date(year, month, 24);
  const to = new Date(year, month + 1, 23);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const dateRangeHeader = `${formatDate(from)} - ${formatDate(to)}`;
  const totalViewsHeader = `Total Views between ${formatDate(from)} and ${formatDate(to)}`;
  const monthLabel = from.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); // e.g., "July 2025"

  return { dateRangeHeader, totalViewsHeader, monthLabel };
};


/**
 * Generate KPI date headers and range for any given month/year
 * @param month Index from 0 (Jan) to 11 (Dec)
 * @param year Full year (e.g., 2025)
 */
export const getMonthlyKpiRange = (month: number, year: number) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const start = new Date(year, month, 23);
  const end = new Date(year, month + 1, 23, 23, 59, 59);

  const dateRangeHeader = `${start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} - ${end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  const totalViewsHeader = `Total Views between ${dateRangeHeader}`;

  return { dateRangeHeader, totalViewsHeader, start, end };
};

