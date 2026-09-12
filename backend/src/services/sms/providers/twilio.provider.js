import twilio from 'twilio'

class TwilioProvider {
  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_FROM_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials are not configured')
    }

    this.client = twilio(accountSid, authToken)
    this.fromNumber = fromNumber
  }

  async sendSms(to, message) {
    return this.client.messages.create({
      to,
      from: this.fromNumber,
      body: message,
    })
  }
}

export default TwilioProvider
