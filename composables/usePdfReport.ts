// composables/usePdfReport.ts

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import '~/utils/fonts/NotoSansKhmer-normal.js'

interface CreatorData {
  id: number
  staff: string
  target: number
  remarks?: VideoRemark[]
  user_created?: {
    title?: string
    department?: {
      title?: string
    }
  }
}

interface VideoRemark {
  id: number
  title: string
  video_link: string
  view: string
  date_created: string
  big_video: 'yes' | 'no'
  impact_video?: 'yes' | 'no'
  status: string
}

interface ReportOptions {
  title?: string
  subtitle?: string
  includeSummary?: boolean
  includeVideoDetails?: boolean
  includeCharts?: boolean
  logoUrl?: string
}

export const usePdfReport = () => {
  // Font loading flag
  let fontLoaded = false


const loadKhmerFont = async (): Promise<void> => {
  if (fontLoaded) return
  fontLoaded = true
  console.log('Khmer font loaded successfully (registered globally)')
}


  // Set appropriate font based on text content
  const setFont = (doc: jsPDF, text: string, style: 'normal' | 'bold' = 'normal'): void => {
    // Check if text contains Khmer characters (Unicode range U+1780–U+17FF)
    const hasKhmerText = /[\u1780-\u17FF]/.test(text)
    
    if (hasKhmerText && fontLoaded) {
      doc.setFont('NotoSansKhmer-Regular', style)
    } else {
      doc.setFont('helvetica', style)
    }
  }

  // Enhanced text rendering with font detection
  const renderText = (doc: jsPDF, text: string, x: number, y: number, options?: any): void => {
    setFont(doc, text, options?.fontStyle || 'normal')
    doc.text(text, x, y, options)
  }

  // Helper functions from your existing code
  const getTotalViews = (remarks: VideoRemark[] = []): string => {
    return remarks.reduce((sum, remark) => sum + parseInt(remark.view || '0'), 0).toString()
  }

  const countBigVideos = (remarks: VideoRemark[] = []): number => {
    return remarks.filter(r => r.big_video === 'yes').length
  }

  const getBigVideoViews = (remarks: VideoRemark[] = []): string => {
    return remarks
      .filter(r => r.big_video === 'yes')
      .reduce((sum, remark) => sum + parseInt(remark.view || '0'), 0)
      .toString()
  }

  const formatNumber = (num: string | number): string => {
    const value = typeof num === 'string' ? parseInt(num) : num
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isCompleted = (creator: CreatorData): boolean => {
    const totalViews = parseInt(getTotalViews(creator.remarks))
    return totalViews >= creator.target
  }

  const calculatePercent = (creator: CreatorData): number => {
    const totalViews = parseInt(getTotalViews(creator.remarks))
    return Math.round((totalViews / creator.target) * 100)
  }

  const getUserName = (staffId: string, staffMembers: Record<string, string>): string => {
    return staffMembers[staffId] || 'Unknown'
  }

  // Main PDF generation function
  const generatePerformanceReport = async (
    creators: CreatorData[],
    staffMembers: Record<string, string>,
    currentPeriodLabel: string,
    options: ReportOptions = {}
  ): Promise<void> => {
    // Load font first
    await loadKhmerFont()

    const {
      title = 'Staff Performance Report',
      subtitle = currentPeriodLabel,
      includeSummary = true,
      includeVideoDetails = true,
      includeCharts = false
    } = options

    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let yPosition = 20

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace: number = 20): void => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }
    }

    // Add header
    const addHeader = (): void => {
      // Main title
      doc.setFontSize(24)
      setFont(doc, title, 'bold')
      doc.setTextColor(31, 81, 255) // Blue color
      renderText(doc, title, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 12

      // Subtitle
      doc.setFontSize(14)
      setFont(doc, subtitle, 'normal')
      doc.setTextColor(107, 114, 128) // Gray color
      renderText(doc, subtitle, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8

      // Report generated date
      doc.setFontSize(10)
      const dateText = `Generated on: ${new Date().toLocaleDateString()}`
      setFont(doc, dateText, 'normal')
      renderText(doc, dateText, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15

      // Add separator line
      doc.setDrawColor(229, 231, 235)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)
      yPosition += 10
    }

    // Add summary section
    const addSummarySection = (): void => {
      if (!includeSummary) return

      checkPageBreak(40)

      // Section title
      doc.setFontSize(16)
      setFont(doc, 'Performance Summary', 'bold')
      doc.setTextColor(31, 41, 55) // Dark gray
      renderText(doc, 'Performance Summary', 20, yPosition)
      yPosition += 10

      // Calculate summary stats
      const totalCreators = creators.length
      const totalVideos = creators.reduce((sum, c) => sum + (c.remarks?.length || 0), 0)
      const totalViews = creators.reduce((sum, c) => sum + parseInt(getTotalViews(c.remarks || [])), 0)
      const totalBigVideos = creators.reduce((sum, c) => sum + countBigVideos(c.remarks || []), 0)
      const completedTargets = creators.filter(isCompleted).length

      // Create summary cards data
      const summaryData = [
        ['Total Creators', totalCreators.toString()],
        ['Total Videos', totalVideos.toString()],
        ['Total Views', formatNumber(totalViews)],
        ['Big Videos', totalBigVideos.toString()],
        ['Completed Targets', `${completedTargets}/${totalCreators}`],
        ['Completion Rate', `${Math.round((completedTargets / totalCreators) * 100)}%`]
      ]

      // Summary table with font support
      autoTable(doc, {
        startY: yPosition,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246], // Blue
          textColor: 255,
          fontSize: 12,
          fontStyle: 'bold',
          font: fontLoaded ? 'NotoSansKhmer-Regular' : 'helvetica'
        },
        bodyStyles: {
          fontSize: 11,
          textColor: [31, 41, 55],
          font: fontLoaded ? 'NotoSansKhmer-Regular' : 'helvetica'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Light gray
        },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold' },
          1: { cellWidth: 40, halign: 'center' }
        }
      })

      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Add performance table
    const addPerformanceTable = (): void => {
      checkPageBreak(60)

      // Section title
      doc.setFontSize(16)
      setFont(doc, 'Individual Performance', 'bold')
      doc.setTextColor(31, 41, 55)
      renderText(doc, 'Individual Performance', 20, yPosition)
      yPosition += 10

      // Prepare table data with combined name column
      const tableData = creators.map(creator => {
        const creatorName = getUserName(creator.staff, staffMembers)
        const position = creator.user_created?.title || 'N/A'
        const department = creator.user_created?.department?.title || 'N/A'
        
        const target = formatNumber(creator.target)
        const status = isCompleted(creator) ? 'Completed' : 'In Progress'
        const videoCount = creator.remarks?.length || 0
        const totalViews = formatNumber(getTotalViews(creator.remarks || []))
        const bigVideos = countBigVideos(creator.remarks || [])
        const progress = `${calculatePercent(creator)}%`

        return [
          `${creatorName}\n${position}\n${department}`,
          target,
          status,
          videoCount.toString(),
          totalViews,
          bigVideos.toString(),
          progress
        ]
      })

      // Performance table with font support
      autoTable(doc, {
        startY: yPosition,
        head: [['Name & Details', 'Target', 'Status', 'Videos', 'Total Views', 'Big Videos', 'Progress']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
          font: fontLoaded ? 'NotoSansKhmer-Regular' : 'helvetica'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [31, 41, 55],
          font: fontLoaded ? 'NotoSansKhmer-Regular' : 'helvetica'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 45, valign: 'top' },
          1: { cellWidth: 20, halign: 'right' },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 25, halign: 'right' },
          5: { cellWidth: 18, halign: 'center' },
          6: { cellWidth: 18, halign: 'center' }
        },
        didParseCell: (data) => {
          // Set font for each cell based on content
          if (data.cell.text && data.cell.text.length > 0) {
            const cellText = data.cell.text.join(' ')
            if (/[\u1780-\u17FF]/.test(cellText) && fontLoaded) {
              data.cell.styles.font = 'NotoSansKhmer-Regular'
            }
          }

          // Color code status column
          if (data.column.index === 2) {
            const statusText = data.cell.text?.[0]
            if (statusText === 'Completed') {
              data.cell.styles.textColor = [34, 197, 94] // Green
              data.cell.styles.fontStyle = 'bold'
            } else if (statusText === 'In Progress') {
              data.cell.styles.textColor = [251, 191, 36] // Yellow
              data.cell.styles.fontStyle = 'bold'
            }
          }
          
          // Color code progress column
          if (data.column.index === 6) {
            const progressText = data.cell.text?.[0]
            if (progressText) {
              const progress = parseInt(progressText)
              if (!isNaN(progress)) {
                if (progress >= 100) {
                  data.cell.styles.textColor = [34, 197, 94] // Green
                  data.cell.styles.fontStyle = 'bold'
                } else if (progress >= 75) {
                  data.cell.styles.textColor = [251, 191, 36] // Yellow
                } else {
                  data.cell.styles.textColor = [239, 68, 68] // Red
                }
              }
            }
          }
        },
        didDrawCell: (data) => {
          // Custom drawing for the name column with font support
          if (data.column.index === 0 && data.row.index < tableData.length) {
            try {
              const originalText = tableData[data.row.index]?.[0]
              if (!originalText) return
              
              const lines = originalText.split('\n')
              
              if (lines.length >= 3) {
                const [name, position, department] = lines
                const cellX = data.cell.x + 3
                let cellY = data.cell.y + 6
                
                // Draw name (bold, normal size)
                setFont(doc, name, 'bold')
                doc.setFontSize(9)
                doc.setTextColor(31, 41, 55)
                doc.text(name || '', cellX, cellY)
                cellY += 4
                
                // Draw position (normal, smaller size, gray)
                setFont(doc, position, 'normal')
                doc.setFontSize(7)
                doc.setTextColor(107, 114, 128)
                doc.text(position || '', cellX, cellY)
                cellY += 3
                
                // Draw department (normal, smaller size, gray)
                setFont(doc, department, 'normal')
                doc.setFontSize(7)
                doc.setTextColor(107, 114, 128)
                doc.text(department || '', cellX, cellY)
              }
            } catch (error) {
              console.warn('Error in custom cell rendering:', error)
            }
          }
        }
      })

      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Add detailed video listings
    const addVideoDetails = (): void => {
      if (!includeVideoDetails) return

      creators.forEach((creator, creatorIndex) => {
        const creatorName = getUserName(creator.staff, staffMembers)
        const videos = creator.remarks || []

        if (videos.length === 0) return

        checkPageBreak(40)

        // Creator name header
        doc.setFontSize(14)
        setFont(doc, creatorName, 'bold')
        doc.setTextColor(31, 41, 55)
        renderText(doc, `${creatorName} - Video Details`, 20, yPosition)
        yPosition += 8

        // Creator stats
        doc.setFontSize(10)
        setFont(doc, 'stats', 'normal')
        doc.setTextColor(107, 114, 128)
        const creatorStats = `${videos.length} videos • ${formatNumber(getTotalViews(videos))} total views • ${countBigVideos(videos)} big videos`
        renderText(doc, creatorStats, 20, yPosition)
        yPosition += 10

        // Video details table
        const videoData = videos.map(video => [
          video.title.length > 30 ? video.title.substring(0, 30) + '...' : video.title,
          formatNumber(video.view),
          video.big_video === 'yes' ? 'Yes' : 'No',
          video.impact_video === 'yes' ? 'Yes' : 'No',
          formatDate(video.date_created),
          video.status
        ])

        autoTable(doc, {
          startY: yPosition,
          head: [['Video Title', 'Views', 'Big Video', 'Impact', 'Date', 'Status']],
          body: videoData,
          theme: 'grid',
          headStyles: {
            fillColor: [79, 70, 229], // Indigo
            textColor: 255,
            fontSize: 9,
            fontStyle: 'bold',
            font: fontLoaded ? 'NotoSansKhmer-Regular' : 'helvetica'
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [31, 41, 55],
            font: fontLoaded ? 'NotoSansKhmer-Regular' : 'helvetica'
          },
          margin: { left: 20, right: 20 },
          columnStyles: {
            0: { cellWidth: 60 }, // Title
            1: { cellWidth: 25, halign: 'right' }, // Views
            2: { cellWidth: 20, halign: 'center' }, // Big Video
            3: { cellWidth: 20, halign: 'center' }, // Impact
            4: { cellWidth: 25, halign: 'center' }, // Date
            5: { cellWidth: 20, halign: 'center' } // Status
          },
          didParseCell: (data) => {
            // Set font for each cell based on content
            if (data.cell.text && data.cell.text.length > 0) {
              const cellText = data.cell.text.join(' ')
              if (/[\u1780-\u17FF]/.test(cellText) && fontLoaded) {
                data.cell.styles.font = 'NotoSansKhmer-Regular'
              }
            }

            // Color code Big Video column
            if (data.column.index === 2) {
              if (data.cell.text[0] === 'Yes') {
                data.cell.styles.textColor = [239, 68, 68] // Red
                data.cell.styles.fontStyle = 'bold'
              }
            }
            // Color code Impact column
            if (data.column.index === 3) {
              if (data.cell.text[0] === 'Yes') {
                data.cell.styles.textColor = [251, 146, 60] // Orange
                data.cell.styles.fontStyle = 'bold'
              }
            }
            // Color code Status column
            if (data.column.index === 5) {
              if (data.cell.text[0] === 'active') {
                data.cell.styles.textColor = [34, 197, 94] // Green
              } else {
                data.cell.styles.textColor = [239, 68, 68] // Red
              }
            }
          }
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15

        // Add page break if not the last creator
        if (creatorIndex < creators.length - 1) {
          checkPageBreak(40)
        }
      })
    }

    // Add footer to all pages
    const addFooter = (): void => {
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(107, 114, 128)
        
        // Set font for footer text
        setFont(doc, `Page ${i} of ${pageCount}`, 'normal')
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        )
        
        setFont(doc, 'Staff Performance Report', 'normal')
        doc.text(
          'Staff Performance Report',
          20,
          pageHeight - 10
        )
        
        const dateText = new Date().toLocaleDateString()
        setFont(doc, dateText, 'normal')
        doc.text(
          dateText,
          pageWidth - 20,
          pageHeight - 10,
          { align: 'right' }
        )
      }
    }

    // Generate the report
    addHeader()
    addSummarySection()
    addPerformanceTable()
    addVideoDetails()
    addFooter()

    // Save the PDF
    const filename = `staff-performance-report-${currentPeriodLabel.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`
    doc.save(filename)
  }

  // Generate summary report (without video details)
  const generateSummaryReport = async (
    creators: CreatorData[],
    staffMembers: Record<string, string>,
    currentPeriodLabel: string
  ): Promise<void> => {
    await generatePerformanceReport(creators, staffMembers, currentPeriodLabel, {
      title: 'Staff Performance Summary',
      includeSummary: true,
      includeVideoDetails: false
    })
  }

  // Generate detailed report (with all video details)
  const generateDetailedReport = async (
    creators: CreatorData[],
    staffMembers: Record<string, string>,
    currentPeriodLabel: string
  ): Promise<void> => {
    await generatePerformanceReport(creators, staffMembers, currentPeriodLabel, {
      title: 'Detailed Staff Performance Report',
      includeSummary: true,
      includeVideoDetails: true
    })
  }

  return {
    generatePerformanceReport,
    generateSummaryReport,
    generateDetailedReport,
    loadKhmerFont // Export for manual loading if needed
  }
}