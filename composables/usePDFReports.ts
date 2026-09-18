
// composables/usePDFReport.ts
import type { ActivityItem, PDFReportOptions } from "~/types/activity";

export const usePDFReport = () => {
  const { $toast } = useNuxtApp();
  
  const generateActivityReport = async (
    data: ActivityItem[], 
    options: PDFReportOptions = {}
  ) => {
    try {
      const generator = new ActivityReportGenerator(options);
      generator.generateReport(data, options);
      generator.save();
      
      if ($toast) {
        $toast.success('PDF report generated successfully!');
      }
    } catch (error) {
      console.error('Error generating PDF report:', error);
      if ($toast) {
        $toast.error('Failed to generate PDF report');
      }
    }
  };

  return {
    generateActivityReport
  };
};

// export class ActivityReportGenerator {