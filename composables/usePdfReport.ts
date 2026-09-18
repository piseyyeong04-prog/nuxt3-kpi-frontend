// composables/usePdfReport.ts
// Opens the report in a new window and triggers window.print() so the browser
// handles all Khmer shaping natively — no jsPDF, no html2canvas.

import NotoSansKhmerBase64 from '~/utils/fonts/NotoSansKhmerBase64'

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
  logoUrl?: string
}

export const usePdfReport = () => {

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const getTotalViews = (remarks: VideoRemark[] = []): string =>
    remarks.reduce((sum, r) => sum + parseInt(r.view || '0'), 0).toString()

  const countBigVideos = (remarks: VideoRemark[] = []): number =>
    remarks.filter(r => r.big_video === 'yes').length

  const formatNumber = (num: string | number): string => {
    const v = typeof num === 'string' ? parseInt(num) : num
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M'
    if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K'
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const formatDate = (d: string): string =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const isCompleted = (c: CreatorData): boolean =>
    parseInt(getTotalViews(c.remarks)) >= c.target

  const calcPct = (c: CreatorData): number => {
    const t = parseInt(getTotalViews(c.remarks))
    return Math.round((t / c.target) * 100)
  }

  const getName = (id: string, map: Record<string, string>): string =>
    map[id] || id || 'Unknown'

  // ─── HTML builder ─────────────────────────────────────────────────────────────

  const buildHtml = (
    creators: CreatorData[],
    staffMembers: Record<string, string>,
    periodLabel: string,
    options: ReportOptions = {}
  ): string => {
    const {
      title = 'Staff Performance Report',
      subtitle = periodLabel,
      includeSummary = true,
      includeVideoDetails = true,
    } = options

    const totalCreators = creators.length
    const totalVideos = creators.reduce((s, c) => s + (c.remarks?.length || 0), 0)
    const totalViews = creators.reduce((s, c) => s + parseInt(getTotalViews(c.remarks)), 0)
    const totalBig = creators.reduce((s, c) => s + countBigVideos(c.remarks || []), 0)
    const done = creators.filter(isCompleted).length

    // ── CSS (embedded @font-face = no CORS issues) ──────────────────────────
    const css = `
      @font-face {
        font-family: 'KhmerFont';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/truetype;base64,${NotoSansKhmerBase64}') format('truetype');
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: 'KhmerFont', Arial, sans-serif;
        font-size: 11pt;
        color: #1f2937;
        background: #fff;
        padding: 0;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 14mm 12mm;
        margin: 0 auto;
        background: #fff;
      }

      /* ── Header ── */
      .header { text-align: center; margin-bottom: 14pt; }
      .header h1 { font-size: 20pt; font-weight: 700; color: #1d4ed8; margin-bottom: 3pt; }
      .header .sub { font-size: 11pt; color: #6b7280; }
      .divider { border: none; border-top: 1.5px solid #e5e7eb; margin: 10pt 0; }

      /* ── Section title ── */
      .section-title {
        font-size: 13pt;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 6pt;
        padding-bottom: 4pt;
        border-bottom: 2px solid #3b82f6;
      }

      /* ── Summary cards ── */
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8pt;
        margin-bottom: 16pt;
      }
      .card {
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 6px;
        padding: 10pt;
        text-align: center;
      }
      .card .val { font-size: 18pt; font-weight: 700; color: #1d4ed8; }
      .card .lbl { font-size: 8pt; color: #6b7280; margin-top: 2pt; }

      /* ── Tables ── */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16pt;
        page-break-inside: auto;
      }
      tr { page-break-inside: avoid; page-break-after: auto; }
      thead { display: table-header-group; }

      th {
        background: #2563eb;
        color: #fff;
        font-size: 9pt;
        font-weight: 700;
        padding: 6pt 7pt;
        text-align: left;
        font-family: Arial, 'KhmerFont', sans-serif;
      }
      th.c { text-align: center; }
      th.r { text-align: right; }

      td {
        padding: 5pt 7pt;
        border-bottom: 1px solid #e5e7eb;
        font-size: 9.5pt;
        font-family: 'KhmerFont', Arial, sans-serif;
        vertical-align: top;
      }
      tr:nth-child(even) td { background: #f9fafb; }
      td.c { text-align: center; }
      td.r { text-align: right; }

      .name  { font-weight: 700; }
      .small { font-size: 8pt; color: #6b7280; margin-top: 1pt; }

      .green  { color: #15803d; font-weight: 700; }
      .yellow { color: #b45309; font-weight: 700; }
      .red    { color: #dc2626; font-weight: 700; }

      /* ── Creator section header ── */
      .creator-hdr { margin-top: 14pt; margin-bottom: 4pt; page-break-inside: avoid; }
      .creator-hdr h3 { font-size: 12pt; font-weight: 700; }
      .creator-hdr p  { font-size: 9pt; color: #6b7280; margin-top: 2pt; }

      .video-th { background: #4338ca; }

      /* ── Footer ── */
      .footer {
        margin-top: 16pt;
        font-size: 8pt;
        color: #9ca3af;
        text-align: center;
        border-top: 1px solid #e5e7eb;
        padding-top: 6pt;
      }

      @page {
        size: A4;
        margin: 0;
      }

      /* ── Print tweaks ── */
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { padding: 10mm 10mm; width: 100%; }
        .no-break { page-break-inside: avoid; }
        .page-break { page-break-before: always; break-before: page; }
      }
    `

    // ── Build HTML ─────────────────────────────────────────────────────────────
    let h = `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>${title} — ${periodLabel}</title>
  <style>${css}</style>
</head>
<body>
<div class="page">`

    // Header
    h += `
  <div class="header">
    <h1>${title}</h1>
    <div class="sub">${subtitle}</div>
    <div class="sub" style="font-size:9pt;margin-top:3pt;color:#9ca3af">Generated: ${new Date().toLocaleDateString()}</div>
  </div>
  <hr class="divider">`

    // Summary
    if (includeSummary) {
      h += `
  <div class="section-title">Performance Summary</div>
  <div class="summary-grid">
    <div class="card"><div class="val">${totalCreators}</div><div class="lbl">Total Creators</div></div>
    <div class="card"><div class="val">${totalVideos}</div><div class="lbl">Total Videos</div></div>
    <div class="card"><div class="val">${formatNumber(totalViews)}</div><div class="lbl">Total Views</div></div>
    <div class="card"><div class="val">${totalBig}</div><div class="lbl">Big Videos</div></div>
    <div class="card"><div class="val">${done}/${totalCreators}</div><div class="lbl">Targets Done</div></div>
    <div class="card"><div class="val">${Math.round((done / totalCreators) * 100)}%</div><div class="lbl">Completion Rate</div></div>
  </div>`
    }

    // Performance table
    h += `
  <div class="section-title">Individual Performance</div>
  <table>
    <thead><tr>
      <th style="width:34%">Name &amp; Details</th>
      <th class="r" style="width:12%">Target</th>
      <th class="c" style="width:14%">Status</th>
      <th class="c" style="width:9%">Videos</th>
      <th class="r" style="width:13%">Total Views</th>
      <th class="c" style="width:9%">Big</th>
      <th class="c" style="width:9%">Progress</th>
    </tr></thead>
    <tbody>`

    for (const creator of creators) {
      const name = getName(creator.staff, staffMembers)
      const pos = creator.user_created?.title || ''
      const dept = creator.user_created?.department?.title || ''
      const completed = isCompleted(creator)
      const pct = calcPct(creator)
      const statusCls = completed ? 'green' : 'yellow'
      const pctCls = pct >= 100 ? 'green' : pct >= 75 ? 'yellow' : 'red'

      h += `
      <tr>
        <td>
          <div class="name">${name}</div>
          ${pos ? `<div class="small">${pos}</div>` : ''}
          ${dept ? `<div class="small">${dept}</div>` : ''}
        </td>
        <td class="r">${formatNumber(creator.target)}</td>
        <td class="c ${statusCls}">${completed ? 'Completed' : 'In Progress'}</td>
        <td class="c">${creator.remarks?.length || 0}</td>
        <td class="r">${formatNumber(getTotalViews(creator.remarks))}</td>
        <td class="c">${countBigVideos(creator.remarks || [])}</td>
        <td class="c ${pctCls}">${pct}%</td>
      </tr>`
    }
    h += `</tbody></table>`

    // Video details
    if (includeVideoDetails) {
      let creatorCount = 0
      for (const creator of creators) {
        const videos = creator.remarks || []
        if (!videos.length) continue
        const name = getName(creator.staff, staffMembers)
        const pos = creator.user_created?.title || ''
        const dept = creator.user_created?.department?.title || ''
        const needsPageBreak = creatorCount > 0 || includeSummary
        creatorCount++

        const targetViews = formatNumber(creator.target)
        const creatorVideos = videos.length
        const creatorViews = formatNumber(getTotalViews(videos))
        const creatorBig = countBigVideos(videos)
        const completed = isCompleted(creator)
        const pct = calcPct(creator)
        const statusText = completed ? 'Completed' : 'In Progress'
        const statusCls = completed ? 'green' : 'yellow'
        const pctCls = pct >= 100 ? 'green' : pct >= 75 ? 'yellow' : 'red'

        h += `
  <div class="${needsPageBreak ? 'page-break' : ''}">
    <div class="creator-hdr no-break">
      <h3>${name} — Video Details</h3>
      <p>${pos ? `${pos}` : ''}${pos && dept ? ' &bull; ' : ''}${dept ? `${dept}` : ''}</p>
    </div>

    <div class="summary-grid" style="margin-top: 10pt;">
      <div class="card"><div class="val">${targetViews}</div><div class="lbl">Target Views</div></div>
      <div class="card"><div class="val">${creatorVideos}</div><div class="lbl">Total Videos</div></div>
      <div class="card"><div class="val">${creatorViews}</div><div class="lbl">Total Views</div></div>
      <div class="card"><div class="val">${creatorBig}</div><div class="lbl">Big Videos</div></div>
      <div class="card"><div class="val ${statusCls}">${statusText}</div><div class="lbl">Target Status</div></div>
      <div class="card"><div class="val ${pctCls}">${pct}%</div><div class="lbl">Progress</div></div>
    </div>

    <table>
      <thead><tr>
        <th style="width:46%" class="video-th">Video Title</th>
        <th class="r video-th" style="width:14%">Views</th>
        <th class="c video-th" style="width:10%">Big</th>
        <th class="c video-th" style="width:10%">Impact</th>
        <th class="c video-th" style="width:13%">Date</th>
        <th class="c video-th" style="width:7%">Status</th>
      </tr></thead>
      <tbody>`

        for (const v of videos) {
          const isBig = v.big_video === 'yes'
          const isImpact = v.impact_video === 'yes'
          const isActive = v.status === 'active'
          const titleTxt = v.title.length > 60 ? v.title.slice(0, 60) + '…' : v.title

          h += `
        <tr>
          <td>${titleTxt}</td>
          <td class="r">${formatNumber(v.view)}</td>
          <td class="c ${isBig ? 'red' : ''}">${isBig ? 'Yes' : 'No'}</td>
          <td class="c ${isImpact ? 'yellow' : ''}">${isImpact ? 'Yes' : 'No'}</td>
          <td class="c">${formatDate(v.date_created)}</td>
          <td class="c ${isActive ? 'green' : 'red'}">${v.status}</td>
        </tr>`
        }
        h += `</tbody></table>
  </div>`
      }
    }

    h += `
  <div class="footer">Staff Performance Report &mdash; ${periodLabel} &mdash; ${new Date().toLocaleDateString()}</div>
</div>
</body>
</html>`

    return h
  }

  // ─── Print renderer ───────────────────────────────────────────────────────────

  const printReport = (htmlContent: string, filename: string): void => {
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) {
      alert('Please allow popups for this page to generate the PDF report.')
      return
    }

    win.document.open()
    win.document.write(htmlContent)
    win.document.close()

    // Set title directly
    win.document.title = filename.replace(/\.pdf$/i, '')

    // Wait for the browser to render the written content & fonts
    const triggerPrint = () => {
      if (win.document.fonts) {
        win.document.fonts.ready.then(() => {
          setTimeout(() => {
            win.focus()
            win.print()
            win.onafterprint = () => win.close()
          }, 400) // Small delay to guarantee layout calculations complete
        }).catch(() => {
          setTimeout(() => {
            win.focus()
            win.print()
            win.onafterprint = () => win.close()
          }, 600)
        })
      } else {
        setTimeout(() => {
          win.focus()
          win.print()
          win.onafterprint = () => win.close()
        }, 800)
      }
    }

    // Execute in the next event loop tick to allow initial browser parsing/rendering
    setTimeout(triggerPrint, 100)
  }

  // ─── Public API ───────────────────────────────────────────────────────────────

  const generatePerformanceReport = async (
    creators: CreatorData[],
    staffMembers: Record<string, string>,
    currentPeriodLabel: string,
    options: ReportOptions = {}
  ): Promise<void> => {
    const html = buildHtml(creators, staffMembers, currentPeriodLabel, options)
    const safeLabel = currentPeriodLabel.replace(/\s+/g, '-').toLowerCase()
    const date = new Date().toISOString().slice(0, 10)
    printReport(html, `staff-performance-report-${safeLabel}-${date}.pdf`)
  }

  const generateSummaryReport = async (
    creators: CreatorData[],
    staffMembers: Record<string, string>,
    currentPeriodLabel: string
  ): Promise<void> => {
    await generatePerformanceReport(creators, staffMembers, currentPeriodLabel, {
      title: 'Staff Performance Summary',
      includeSummary: true,
      includeVideoDetails: false,
    })
  }

  const generateDetailedReport = async (
    creators: CreatorData[],
    staffMembers: Record<string, string>,
    currentPeriodLabel: string
  ): Promise<void> => {
    await generatePerformanceReport(creators, staffMembers, currentPeriodLabel, {
      title: 'Detailed Staff Performance Report',
      includeSummary: true,
      includeVideoDetails: true,
    })
  }

  // no-op kept for API compatibility
  const loadKhmerFont = async (): Promise<void> => {}

  return {
    generatePerformanceReport,
    generateSummaryReport,
    generateDetailedReport,
    loadKhmerFont,
  }
}