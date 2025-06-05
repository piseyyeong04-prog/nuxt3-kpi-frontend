import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { formatNumber } from './format';
import { getTotalViews, isCompleted } from './creators';

interface Creator {
  id: number;
  status: string;
  staff: string;
  target: number;
  user_created: {
    title: string;
    department: {
      title: string;
    };
  };
  remarks?: Remark[];
}

interface Remark {
  id: string;
  title: string;
  video_link: string;
  view: string;
  status: string;
}

interface UserInfo {
  first_name: string;
  last_name: string;
}

/**
 * Generates and downloads a CSV file with creator performance summary data
 * @param creators List of creators with their performance data
 * @param staffMembers Map of staff IDs to their names
 * @param currentUser Current user info (fallback if staff name not found)
 */
export const exportToCSV = (
  creators: Creator[],
  staffMembers: Record<string, string>,
  currentUser?: UserInfo
) => {
  if (!creators || creators.length === 0) {
    return {
      success: false,
      error: 'No data available to export'
    };
  }

  // Create CSV data structure
  const csvData = creators.map(creator => {
    // Get the staff member name
    const name = getUserName(creator.staff, staffMembers, currentUser);

    // Get their position and department
    const position = creator.user_created?.title || 'N/A';
    const department = creator.user_created?.department?.title || 'N/A';

    // Get their view target and status
    const viewTarget = creator.target || 0;
    const status = isCompleted(creator) ? 'Completed' : 'In Progress';

    // Get number of videos and total views
    const numVideos = creator.remarks?.length || 0;
    const totalViews = getTotalViews(creator.remarks);

    // Get all video links as a single string (comma separated)
    const videoLinks = creator.remarks?.map(r => r.video_link).join(', ') || '';

    return {
      Name: name,
      Position: position,
      Department: department,
      "View Target": viewTarget,
      Status: status,
      "Number of Videos": numVideos,
      "Total Views": totalViews,
      "Video Links": videoLinks
    };
  });

  // Convert to CSV format
  const csv = Papa.unparse(csvData);

  // Create a Blob and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `video-performance-${new Date().toISOString().slice(0, 10)}.csv`);

  return {
    success: true,
    message: 'CSV file has been generated and downloaded'
  };
};

/**
 * Generates and downloads a detailed CSV file with individual video data
 * @param creators List of creators with their performance data
 * @param staffMembers Map of staff IDs to their names
 * @param currentUser Current user info (fallback if staff name not found)
 */
export const exportDetailedCSV = (
  creators: Creator[],
  staffMembers: Record<string, string>,
  currentUser?: UserInfo
) => {
  if (!creators || creators.length === 0) {
    return {
      success: false,
      error: 'No data available to export'
    };
  }

  // Create a more detailed CSV with one row per video
  const detailedData: any[] = [];

  creators.forEach(creator => {
    const name = getUserName(creator.staff, staffMembers, currentUser);
    const position = creator.user_created?.title || 'N/A';
    const department = creator.user_created?.department?.title || 'N/A';
    const viewTarget = creator.target || 0;
    const status = isCompleted(creator) ? 'Completed' : 'In Progress';
    const totalViews = getTotalViews(creator.remarks);

    // If creator has no videos, add a single row
    if (!creator.remarks || creator.remarks.length === 0) {
      detailedData.push({
        Name: name,
        Position: position,
        Department: department,
        "View Target": viewTarget,
        Status: status,
        "Video Title": "N/A",
        "Video Link": "N/A",
        "Views": 0,
        "Total Views": totalViews
      });
    } else {
      // Add one row per video
      creator.remarks.forEach(video => {
        detailedData.push({
          Name: name,
          Position: position,
          Department: department,
          "View Target": viewTarget,
          Status: status,
          "Video Title": video.title || "Untitled",
          "Video Link": video.video_link || "N/A",
          "Views": formatNumber(video.view) || 0,
          "Total Views": totalViews
        });
      });
    }
  });

  // Convert to CSV format
  const csv = Papa.unparse(detailedData);

  // Create a Blob and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `detailed-video-performance-${new Date().toISOString().slice(0, 10)}.csv`);

  return {
    success: true,
    message: 'Detailed CSV file has been generated and downloaded'
  };
};

/**
 * Helper function to get the formatted name of a staff member
 */
const getUserName = (
  staffId: string,
  staffMembers: Record<string, string>,
  currentUser?: UserInfo
): string => {
  return staffMembers[staffId] || 
    (currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Unknown');
};