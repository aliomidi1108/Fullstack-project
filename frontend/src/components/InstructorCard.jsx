import Card from './Card'

function InstructorCard({ instructor }) {
  return (
    <Card className="p-6 text-right shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={instructor.image}
          alt={instructor.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <h4 className="text-body-lg font-semibold text-text-primary">
          {instructor.name}
        </h4>
      </div>
      <p className="text-body-md font-normal text-text-secondary leading-relaxed">
        {instructor.bio}
      </p>
    </Card>
  )
}

export default InstructorCard
