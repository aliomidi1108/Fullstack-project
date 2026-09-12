import Card from './Card'

function TestimonialCard({ testimonial }) {
  return (
    <Card className="p-6 text-right shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="space-y-1">
          <h4 className="text-body-lg font-semibold text-text-primary">
            {testimonial.name}
          </h4>
          <p className="text-body-md font-normal text-text-secondary">
            {testimonial.course}
          </p>
        </div>
      </div>
      <p className="text-body-lg font-normal text-text-primary leading-relaxed">
        {testimonial.feedback}
      </p>
    </Card>
  )
}

export default TestimonialCard
