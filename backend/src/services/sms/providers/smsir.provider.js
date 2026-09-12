class SmsIrProvider {
  constructor() {
    const apiKey = process.env.SMSIR_API_KEY
    const templateId = process.env.SMSIR_TEMPLATE_ID
    const sender = process.env.SMSIR_SENDER
    const apiBase = process.env.SMSIR_API_BASE || 'https://api.sms.ir/v1'

    if (!apiKey) {
      throw new Error('SMS.ir API key is not configured')
    }

    this.apiKey = apiKey
    this.templateId = templateId ? String(templateId).trim() : ''
    this.sender = sender ? String(sender).trim() : ''
    this.apiBase = apiBase.replace(/\/+$/, '')
  }

  async sendOtp({ to, otp, ttlMinutes, message }) {
    if (this.templateId) {
      return this.sendTemplate({ to, otp, ttlMinutes })
    }
    return this.sendSms(to, message)
  }

  async sendTemplate({ to, otp, ttlMinutes }) {
    const response = await fetch(`${this.apiBase}/send/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey,
      },
      body: JSON.stringify({
        mobile: to,
        templateId: Number(this.templateId),
        parameters: [
          { name: 'CODE', value: String(otp) },
          { name: 'MINUTES', value: String(ttlMinutes || '') },
        ],
      }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok || data?.status === 0) {
      throw new Error('SMS.ir template send failed')
    }

    return data
  }

  async sendSms(to, message) {
    if (!this.sender) {
      throw new Error('SMS.ir sender line is not configured')
    }

    const response = await fetch(`${this.apiBase}/send/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey,
      },
      body: JSON.stringify({
        lineNumber: this.sender,
        messageText: message,
        mobiles: [to],
      }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok || data?.status === 0) {
      throw new Error('SMS.ir send failed')
    }

    return data
  }
}

export default SmsIrProvider
