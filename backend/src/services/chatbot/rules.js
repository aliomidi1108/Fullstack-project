const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const RULES = [
  {
    id: 'payment',
    keywords: ['پرداخت', 'درگاه', 'کارت', 'پرداخت ناموفق', 'payment', 'order'],
    response:
      'برای پرداخت، ابتدا سبد خرید را تکمیل کنید و روی دکمه پرداخت بزنید. وضعیت پرداخت بعد از بازگشت از درگاه مشخص می‌شود و هیچ تضمین مالی از سوی من داده نمی‌شود.',
  },
  {
    id: 'login',
    keywords: ['ورود', 'کد', 'رمز', 'otp', 'login', 'احراز'],
    response:
      'برای ورود، شماره موبایل را وارد کنید و کد پیامک‌شده را تایید کنید. در صورت مشکل، دوباره درخواست کد بزنید یا با پشتیبانی تماس بگیرید.',
  },
  {
    id: 'course_access',
    keywords: ['دوره', 'ویدیو', 'درس', 'کلاس', 'content', 'course', 'دسترسی'],
    response:
      'برای مشاهده محتوای دوره، باید آن را خریداری کرده باشید. پس از خرید، از بخش «دوره‌های من» به محتوای دوره دسترسی دارید.',
  },
  {
    id: 'refund',
    keywords: ['بازگشت وجه', 'refund', 'استرداد', 'پس گرفتن پول'],
    response:
      'درخواست بازگشت وجه بررسی می‌شود و تصمیم نهایی با تیم پشتیبانی است. من نمی‌توانم ضمانت مالی بدهم.',
  },
  {
    id: 'support',
    keywords: ['پشتیبانی', 'تماس', 'support', 'help'],
    response:
      'برای ارتباط با پشتیبانی، از بخش «پشتیبانی» داخل حساب کاربری اقدام کنید تا درخواست شما پیگیری شود.',
  },
]

const getRuleBasedReply = (message) => {
  const text = normalize(message)
  if (!text) return null
  for (const rule of RULES) {
    if (rule.keywords.some((keyword) => text.includes(normalize(keyword)))) {
      return rule.response
    }
  }
  return 'I can help guide you or connect you to support.'
}

export { getRuleBasedReply }
