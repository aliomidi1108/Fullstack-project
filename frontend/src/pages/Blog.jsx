import { useMemo, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import BlogCard from '../components/BlogCard'
import blogImage from '../assets/images/image 16.png'

const posts = [
  {
    _id: 'post-1',
    title: 'عنوان اول',
    excerpt: 'این مقاله به در رابطه با دوره‌های آنلاین که در مانی‌وی...',
    image: blogImage,
    slug: 'post-1',
    createdAt: '2024-06-10',
  },
  {
    _id: 'post-2',
    title: 'عنوان اول',
    excerpt: 'این مقاله به در رابطه با دوره‌های آنلاین که در مانی‌وی...',
    image: blogImage,
    slug: 'post-2',
    createdAt: '2024-06-12',
  },
  {
    _id: 'post-3',
    title: 'عنوان اول',
    excerpt: 'این مقاله به در رابطه با دوره‌های آنلاین که در مانی‌وی...',
    image: blogImage,
    slug: 'post-3',
    createdAt: '2024-06-15',
  },
  {
    _id: 'post-4',
    title: 'عنوان اول',
    excerpt: 'این مقاله به در رابطه با دوره‌های آنلاین که در مانی‌وی...',
    image: blogImage,
    slug: 'post-4',
    createdAt: '2024-06-18',
  },
  {
    _id: 'post-5',
    title: 'عنوان اول',
    excerpt: 'این مقاله به در رابطه با دوره‌های آنلاین که در مانی‌وی...',
    image: blogImage,
    slug: 'post-5',
    createdAt: '2024-06-20',
  },
  {
    _id: 'post-6',
    title: 'عنوان اول',
    excerpt: 'این مقاله به در رابطه با دوره‌های آنلاین که در مانی‌وی...',
    image: blogImage,
    slug: 'post-6',
    createdAt: '2024-06-22',
  },
]

function Blog() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBlogs = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    if (!normalizedTerm) {
      return posts
    }
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(normalizedTerm)
      const excerptMatch = post.excerpt.toLowerCase().includes(normalizedTerm)
      return titleMatch || excerptMatch
    })
  }, [searchTerm])

  return (
    <MainLayout>
      <div className="min-h-screen bg-white pb-16">
        <div className="container mx-auto px-4">
          <span className="sr-only">صفحه مقالات</span>
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-h1 font-bold text-text-primary">مقالات</h1>
            <span className="text-body-lg font-normal text-primary">۳۴ مقاله</span>
          </div>

          <div className="mb-8">
            <input
              type="text"
              placeholder="جستجو در مقالات"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full sm:w-72 pr-5 pl-4 py-3 rounded-full border-2 border-gray-200 text-body-md text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Blog
