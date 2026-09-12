function Reports() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-right">
          <p className="text-body-md text-text-secondary">Total revenue</p>
          <p className="text-card-title font-semibold text-text-primary mt-2">250K</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-right">
          <p className="text-body-md text-text-secondary">Total profit</p>
          <p className="text-card-title font-semibold text-text-primary mt-2">28.5%</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-right">
          <p className="text-body-md text-text-secondary">Total sessions</p>
          <p className="text-card-title font-semibold text-text-primary mt-2">10K</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-card-title font-semibold text-text-primary mb-4 text-right">
          نمودارها
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-56 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-body-md text-text-secondary">
            نمودار درآمد
          </div>
          <div className="h-56 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-body-md text-text-secondary">
            نمودار بازدید
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
