const blogs = [
  {
    id: 1,
    title: 'شروع سرمایه‌گذاری امن',
    slug: 'safe-investing-start',
    content: 'راهنمای کوتاه برای شروع سرمایه‌گذاری با مدیریت ریسک.',
    coverImageUrl: '',
    tags: ['سرمایه گذاری'],
    publishedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'اشتباهات رایج معامله‌گری',
    slug: 'common-trading-mistakes',
    content: 'این مقاله مهم‌ترین اشتباهات رایج معامله‌گری را مرور می‌کند.',
    coverImageUrl: '',
    tags: ['معامله گری'],
    publishedAt: new Date().toISOString(),
  },
]

let nextBlogId = 3

const listBlogs = () => blogs.map((blog) => ({ ...blog }))

const getBlogById = (id) => {
  const bid = Number(id)
  return blogs.find((blog) => blog.id === bid) || null
}

const createBlog = (payload, authorId) => {
  const blog = {
    id: nextBlogId,
    title: String(payload.title || '').trim(),
    slug: String(payload.slug || `blog-${nextBlogId}`).trim(),
    content: String(payload.content || '').trim(),
    coverImageUrl: String(payload.coverImageUrl || '').trim(),
    tags: Array.isArray(payload.tags) ? payload.tags.map((tag) => String(tag).trim()) : [],
    publishedAt: payload.publishedAt || null,
    authorId: Number(authorId) || null,
  }
  blogs.unshift(blog)
  nextBlogId += 1
  return { ...blog }
}

const updateBlog = (id, payload) => {
  const blog = getBlogById(id)
  if (!blog) return null
  if (payload.title !== undefined) blog.title = String(payload.title || '').trim()
  if (payload.slug !== undefined) blog.slug = String(payload.slug || '').trim()
  if (payload.content !== undefined) blog.content = String(payload.content || '').trim()
  if (payload.coverImageUrl !== undefined) {
    blog.coverImageUrl = String(payload.coverImageUrl || '').trim()
  }
  if (payload.tags !== undefined) {
    blog.tags = Array.isArray(payload.tags) ? payload.tags.map((tag) => String(tag).trim()) : []
  }
  if (payload.publishedAt !== undefined) blog.publishedAt = payload.publishedAt || null
  return { ...blog }
}

const deleteBlog = (id) => {
  const bid = Number(id)
  const index = blogs.findIndex((blog) => blog.id === bid)
  if (index < 0) return false
  blogs.splice(index, 1)
  return true
}

export { createBlog, deleteBlog, getBlogById, listBlogs, updateBlog }
