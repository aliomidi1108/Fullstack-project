import {
  createBlog,
  deleteBlog,
  getBlogById,
  listBlogs,
  updateBlog,
} from '../services/blog.service.js'

const listBlogsHandler = async (req, res) => {
  try {
    return res.json(listBlogs())
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const getBlogByIdHandler = async (req, res) => {
  try {
    const blog = getBlogById(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    return res.json(blog)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const createBlogHandler = async (req, res) => {
  try {
    const { title, content } = req.body || {}
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }
    const blog = createBlog(req.body, req.user?.id)
    return res.status(201).json(blog)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const updateBlogHandler = async (req, res) => {
  try {
    const blog = updateBlog(req.params.id, req.body || {})
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    return res.json(blog)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteBlogHandler = async (req, res) => {
  try {
    const deleted = deleteBlog(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    return res.json({ message: 'Blog deleted' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export {
  createBlogHandler as createBlog,
  deleteBlogHandler as deleteBlog,
  getBlogByIdHandler as getBlogById,
  listBlogsHandler as listBlogs,
  updateBlogHandler as updateBlog,
}
