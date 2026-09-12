import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'آکادمی مانی وی'

const PATH_TITLES = {
  '/': `${SITE_NAME} | بزرگترین آکادمی عکاسی در ایران`,
  '/courses': `دوره‌های آموزشی | ${SITE_NAME}`,
  '/about': `درباره ما | ${SITE_NAME}`,
  '/blog': `مقالات | ${SITE_NAME}`,
  '/contact': `تماس با ما | ${SITE_NAME}`,
  '/login': `ورود | ${SITE_NAME}`,
  '/register': `ثبت‌نام | ${SITE_NAME}`,
  '/verify-otp': `تایید کد | ${SITE_NAME}`,
  '/dashboard': `پنل کاربری | ${SITE_NAME}`,
  '/dashboard/my-courses': `دوره‌های من | ${SITE_NAME}`,
  '/dashboard/wallet': `کیف پول | ${SITE_NAME}`,
  '/dashboard/basket': `سبد خرید | ${SITE_NAME}`,
  '/dashboard/profile': `ویرایش پروفایل | ${SITE_NAME}`,
  '/dashboard/support': `پشتیبانی | ${SITE_NAME}`,
  '/admin': `پنل مدیریت | ${SITE_NAME}`,
  '/payment/success': `پرداخت موفق | ${SITE_NAME}`,
  '/payment/failure': `پرداخت ناموفق | ${SITE_NAME}`,
  '/payment/failed': `پرداخت ناموفق | ${SITE_NAME}`,
  '/payment/result': `نتیجه پرداخت | ${SITE_NAME}`,
}

function getTitleForPath(pathname) {
  if (PATH_TITLES[pathname]) return PATH_TITLES[pathname]
  if (pathname.startsWith('/courses/') && pathname.endsWith('/content')) return `محتوای دوره | ${SITE_NAME}`
  if (pathname.startsWith('/courses/')) return `جزئیات دوره | ${SITE_NAME}`
  return `${SITE_NAME} | بزرگترین آکادمی عکاسی در ایران`
}

function PageTitleUpdater() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = getTitleForPath(pathname)
  }, [pathname])

  return null
}

export default PageTitleUpdater
