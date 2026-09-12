import { Link } from 'react-router-dom'

function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer"
    >
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-52 object-cover"
      />
      <div className="p-5 text-right space-y-2">
        <h3 className="text-card-title font-semibold text-text-primary">
          {post.title}
        </h3>
        <p className="text-body-md font-normal text-text-secondary leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  )
}

export default BlogCard
