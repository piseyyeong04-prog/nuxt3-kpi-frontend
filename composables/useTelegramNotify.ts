// composables/useTelegramNotify.ts
// Sends PR Tracking alerts to the Baksey PR Tracking Alert group → team topics

const BOT_TOKEN  = '8646967554:AAHlU6yaFmI1VOAy3VPepSnX5991EC446Q8'
const CHAT_ID    = '-1003751856959'

/**
 * Department name  →  message_thread_id mapping
 * Add more departments here as new topics are created.
 */
const DEPT_TOPIC_MAP: Record<string, number> = {
  'Technology Cambodia': 3,   // TC Team topic
  'Business Cambodia':   9,   // BC Team topic
  'Healthy Cambodia':    13,  // HC Team topic
}

interface PRNotifyPayload {
  action: 'created' | 'updated' | 'deleted'
  title: string
  client: string
  status: string
  departmentName?: string     // resolved dept name
  creatorName?: string
  editorName?: string
  startDate?: string
  deadline?: string
  collectionLabel?: string
  attachDocumentUrl?: string  // full public URL to the attached file
}

const statusEmoji: Record<string, string> = {
  'Plan':               '💡',
  'Processing':         '⚙️',
  'Shooting / Writing': '🎬',
  'Editing':            '✂️',
  'Checking':           '🔍',
  'Compleated':         '✅',
}

function buildMessage(p: PRNotifyPayload): string {
  const actionLine =
    p.action === 'created' ? '🆕 <b>[PR Record Created]</b>' :
    p.action === 'updated' ? '✏️ <b>[PR Record Updated]</b>' :
                             '🗑️ <b>[PR Record Deleted]</b>'

  const emoji = statusEmoji[p.status] ?? '📋'
  let statusText = `<b>[${p.status.toUpperCase()}]</b>`
  if (p.status === 'Shooting / Writing') {
    statusText = `🔥 <b><u>[${p.status.toUpperCase()}]</u></b> 🔥 (🚨 <b>Focus Required!</b>)`
  }

  const divider = '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯'

  let msg = `${actionLine}\n`
  msg += `${divider}\n`
  msg += `📋 <b>ព័ត៌មានស្នើសុំ PR (PR Details)</b>\n`
  msg += `• 📌 <b>Title:</b> ${p.title}\n`
  msg += `• 🏢 <b>Client:</b> ${p.client}\n`
  msg += `• ${emoji} <b>Status:</b> ${statusText}\n`
  if (p.departmentName)  msg += `• 🏬 <b>Department:</b> ${p.departmentName}\n`
  if (p.collectionLabel) msg += `• 📂 <b>Posted To:</b> ${p.collectionLabel}\n`

  msg += `${divider}\n`
  msg += `✍️ <b>ក្រុមការងារ (Team)</b>\n`
  msg += `• ✍️ <b>Creator/Writer:</b> ${p.creatorName ?? 'N/A'}\n`
  msg += `• 🎞️ <b>Editor:</b> ${p.editorName ?? 'N/A'}\n`

  msg += `${divider}\n`
  msg += `📅 <b>កាលបរិច្ឆេទ (Timeline)</b>\n`
  msg += `• 📅 <b>Start:</b> ${p.startDate ?? 'N/A'}\n`
  msg += `• 🚩 <b>Deadline:</b> ${p.deadline ?? 'N/A'}\n`

  if (p.attachDocumentUrl) {
    msg += `${divider}\n`
    msg += `📎 <b>Attachment:</b> <a href="${p.attachDocumentUrl}">View File</a>\n`
  }

  return msg.trim()
}

async function sendToTelegram(text: string, threadId: number): Promise<void> {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        message_thread_id: threadId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    })
  } catch (err) {
    console.warn('[useTelegramNotify] Failed to send Telegram message', err)
  }
}

/**
 * Try to send as a Telegram document (so the file previews inline).
 * Falls back to a plain text message if the URL is unreachable by Telegram servers.
 */
async function sendDocumentToTelegram(fileUrl: string, caption: string, threadId: number): Promise<void> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        message_thread_id: threadId,
        document: fileUrl,
        caption,
        parse_mode: 'HTML',
      }),
    })
    const data = await res.json()
    if (!data.ok) {
      // File URL not reachable from Telegram servers — fall back to text with clickable link
      console.warn('[useTelegramNotify] sendDocument failed:', data.description, '— falling back to text')
      await sendToTelegram(caption, threadId)
    }
  } catch (err) {
    console.warn('[useTelegramNotify] sendDocument error — falling back to text', err)
    await sendToTelegram(caption, threadId)
  }
}

export const useTelegramNotify = () => {
  /**
   * Notify the correct topic based on departmentName.
   * Only fires when the department has a matching entry in DEPT_TOPIC_MAP.
   * If attachDocumentUrl is provided, the file is sent as a Telegram document.
   */
  const notifyPR = async (payload: PRNotifyPayload): Promise<void> => {
    if (!payload.departmentName) return

    // Case-insensitive lookup
    const deptKey = Object.keys(DEPT_TOPIC_MAP).find(
      k => k.toLowerCase() === payload.departmentName!.trim().toLowerCase()
    )
    if (!deptKey) return

    const threadId = DEPT_TOPIC_MAP[deptKey]
    const text = buildMessage(payload)

    if (payload.attachDocumentUrl) {
      await sendDocumentToTelegram(payload.attachDocumentUrl, text, threadId)
    } else {
      await sendToTelegram(text, threadId)
    }
  }

  return { notifyPR }
}
