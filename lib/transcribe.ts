// Speech-to-text for Telegram voice notes. Telegram only gives us a file_id,
// so we (1) ask Telegram where the file lives, (2) download the audio bytes
// (voice notes are OGG/Opus), and (3) send them to Groq's Whisper endpoint,
// which is OpenAI-API-compatible. Returns the transcript, or null on any failure
// (the caller decides what to tell the user).
//
// Needs GROQ_API_KEY — free at https://console.groq.com (no credit card).
export async function transcribeTelegramVoice(fileId: string): Promise<string | null> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const groqKey = process.env.GROQ_API_KEY?.trim()
  if (!botToken) {
    console.warn('[GLCC] transcribe: TELEGRAM_BOT_TOKEN not set')
    return null
  }
  if (!groqKey) {
    console.warn('[GLCC] transcribe: GROQ_API_KEY not set — voice notes disabled')
    return null
  }

  // 1) Resolve the file path on Telegram's servers.
  const infoRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`)
  const info = await infoRes.json().catch(() => null)
  const filePath = info?.result?.file_path
  if (!filePath) {
    console.error('[GLCC] transcribe: getFile failed:', info?.description || infoRes.status)
    return null
  }

  // 2) Download the actual audio bytes.
  const audioRes = await fetch(`https://api.telegram.org/file/bot${botToken}/${filePath}`)
  if (!audioRes.ok) {
    console.error('[GLCC] transcribe: file download failed:', audioRes.status)
    return null
  }
  const audioBuf = await audioRes.arrayBuffer()

  // 3) Send to Groq Whisper (OpenAI-compatible multipart endpoint).
  // whisper-large-v3-turbo is fast and accurate; response_format=text keeps it tiny.
  const form = new FormData()
  form.append('file', new Blob([audioBuf], { type: 'audio/ogg' }), 'voice.oga')
  form.append('model', 'whisper-large-v3-turbo')
  form.append('response_format', 'text')

  const sttRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${groqKey}` },
    body: form,
  })
  if (!sttRes.ok) {
    const body = await sttRes.text().catch(() => '')
    console.error('[GLCC] transcribe: Groq error:', sttRes.status, body.slice(0, 200))
    return null
  }
  const text = (await sttRes.text()).trim()
  return text || null
}
