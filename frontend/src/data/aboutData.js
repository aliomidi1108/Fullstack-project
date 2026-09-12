import aboutImage from '../assets/images/image 13 (1).png'
import testimonialUser1 from '../assets/images/User1.png'
import testimonialUser2 from '../assets/images/User2.png'
import testimonialUser3 from '../assets/images/User3.png'
import testimonialUser4 from '../assets/images/User4.png'
import instructor1 from '../assets/images/image 15 (1).png'
import instructor2 from '../assets/images/image 15 (2).png'
import instructor3 from '../assets/images/image 15 (3).png'
import instructor4 from '../assets/images/image 15.png'

export const aboutHeader = {
  _id: 'about-header',
  title: 'درباره ما',
  description:
    'مانی‌وی یک مسیر آموزشی مهارت‌محور است؛ یادگیری عملی، نتیجه‌گرا و مناسب نسل جدیدی از خالقان.',
}

export const aboutMain = {
  _id: 'about-main',
  introTitle: 'سلام! اینجا مانی‌وی...',
  introText:
    'اینجا جایی است که یادگیری هوشمند با نیازهای واقعی بازار کار هم‌مسیر می‌شود. ما در مانی‌وی روی مهارت‌های کاربردی تمرکز داریم؛ مهارت‌هایی که در عصر هوش مصنوعی، جایگزین‌پذیر نیستند.',
  highlight: 'در عصر هوش مصنوعی، مهارت مهم‌ترین سرمایه است',
  outroText:
    'تمرکز ما بر آموزش عملی است تا مسیر حرفه‌ای شما از نظریه به عمل برسد و با اعتماد به نفس وارد بازار کار شوید.',
  image: aboutImage,
}

export const missionGoals = [
  {
    _id: 'mission',
    title: 'ماموریت‌های ما',
    description:
      'هدف ما فراهم کردن بستری برای یادگیری عمیق، کاربردی و حرفه‌ای است تا افراد بتوانند با مهارت‌های واقعی وارد بازار کار شوند.',
  },
  {
    _id: 'goals',
    title: 'اهداف ما',
    description:
      'ارتقای سطح آموزش، حمایت از مسیر رشد حرفه‌ای و ساختن آینده‌ای روشن برای دانشجویان با محوریت مهارت.',
  },
]

export const testimonials = [
  {
    _id: 'testimonial-1',
    name: 'صبا صادقی',
    course: 'دانشجوی پکیج نابود نشو!',
    feedback:
      'به جرئت میتونم بگم ثبت نام توی این دوره بهترین تصمیمی بود که توی این چند سال اخیر گرفتم...',
    avatar: testimonialUser1,
  },
  {
    _id: 'testimonial-2',
    name: 'مهدی قاسمی',
    course: 'دانشجوی پکیج نابود نشو!',
    feedback:
      'کیفیت آموزش و پشتیبانی عالی بود. با همین دوره تونستم مسیر کاری خودم رو مشخص کنم.',
    avatar: testimonialUser2,
  },
  {
    _id: 'testimonial-3',
    name: 'مینا یعقوبی',
    course: 'دانشجوی پکیج نابود نشو!',
    feedback:
      'مسیر آموزش کاملا عملی و مرحله‌به‌مرحله بود. خیلی زود تونستم وارد پروژه‌های واقعی بشم.',
    avatar: testimonialUser3,
  },
  {
    _id: 'testimonial-4',
    name: 'محمد رضایی',
    course: 'دانشجوی پکیج نابود نشو!',
    feedback:
      'این دوره کمکم کرد مهارت‌هایی یاد بگیرم که واقعا در بازار کار بهشون نیاز دارم.',
    avatar: testimonialUser4,
  },
]

export const instructors = [
  {
    _id: 'instructor-1',
    name: 'مهدی ملاقره‌شی',
    bio: 'مدرس دوره‌های ماشین لرنینگ با تجربه عملی در پروژه‌های واقعی.',
    image: instructor1,
  },
  {
    _id: 'instructor-2',
    name: 'علی امیری',
    bio: 'متخصص تولید محتوا و آموزش مهارت‌های کاربردی برای ورود به بازار کار.',
    image: instructor2,
  },
  {
    _id: 'instructor-3',
    name: 'سمانه رضایی',
    bio: 'مدرس عکاسی حرفه‌ای با تمرکز بر مسیرهای یادگیری عملی.',
    image: instructor3,
  },
  {
    _id: 'instructor-4',
    name: 'زهرا موسوی',
    bio: 'منتور رشد شغلی و طراحی مسیر یادگیری برای نسل جدید خلاقان.',
    image: instructor4,
  },
]
