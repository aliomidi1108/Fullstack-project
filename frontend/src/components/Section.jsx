function Section({ children, className = '' }) {
  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  )
}

export default Section
