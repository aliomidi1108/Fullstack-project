import { z } from 'zod'

const envSchema = z
  .object({
    USE_DB: z.enum(['true', 'false']).optional(),
    JWT_SECRET: z.string().min(32).optional(),
    JWT_REFRESH_TTL_DAYS: z.string().min(1).optional(),
    OTP_HASH_SECRET: z.string().min(32).optional(),
    DB_HOST: z.string().min(1).optional(),
    DB_PORT: z.string().min(1).optional(),
    DB_NAME: z.string().min(1).optional(),
    DB_USER: z.string().min(1).optional(),
    DB_PASSWORD: z.string().optional(),
    PAYMENT_PROVIDER: z.string().min(1).optional(),
    PAYMENT_CALLBACK_URL: z.string().url().optional(),
    SMS_IR_API_KEY: z.string().min(1).optional(),
    SMS_IR_TEMPLATE_ID: z.string().min(1).optional(),
    ZARINPAL_MERCHANT_ID: z.string().min(1).optional(),
    ZARINPAL_CALLBACK_URL: z.string().url().optional(),
    ZARINPAL_SANDBOX: z.enum(['true', 'false']).optional(),
  })

const validateEnv = () => {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')
    throw new Error(`Invalid environment variables: ${message}`)
  }

  const useDb = process.env.USE_DB === 'true'
  if (!useDb) return

  const requiredDbKeys = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'OTP_HASH_SECRET']
  const missingDbKeys = requiredDbKeys.filter((key) => !String(process.env[key] || '').trim())
  if (missingDbKeys.length > 0) {
    throw new Error(`Invalid environment variables: ${missingDbKeys.join(', ')}`)
  }

  const requiredSmsKeys = ['SMS_IR_API_KEY', 'SMS_IR_TEMPLATE_ID']
  const missingSmsKeys = requiredSmsKeys.filter((key) => !String(process.env[key] || '').trim())
  if (missingSmsKeys.length > 0) {
    throw new Error(`Invalid environment variables (SMS required when USE_DB=true): ${missingSmsKeys.join(', ')}`)
  }

  const requiredZarinpalKeys = ['ZARINPAL_MERCHANT_ID', 'ZARINPAL_CALLBACK_URL']
  const missingZarinpalKeys = requiredZarinpalKeys.filter((key) => !String(process.env[key] || '').trim())
  if (missingZarinpalKeys.length > 0) {
    throw new Error(`Invalid environment variables (Zarinpal required when USE_DB=true): ${missingZarinpalKeys.join(', ')}`)
  }

  const dbPort = Number(process.env.DB_PORT)
  if (!Number.isInteger(dbPort) || dbPort <= 0) {
    throw new Error('Invalid environment variables: DB_PORT')
  }
}

export { validateEnv }
