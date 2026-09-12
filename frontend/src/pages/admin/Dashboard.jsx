function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
        <div className="text-right">
          <h2 className="text-section-title font-semibold text-text-primary">
            پنل کاربری مانی‌وی
          </h2>
          <p className="text-body-md text-text-secondary mt-1">مدیر عزیز خوش آمدید!</p>
        </div>
        <div className="flex items-center gap-6 text-body-md text-text-secondary">
          <span className="text-primary font-semibold">تهیه گزارش</span>
          <span>استخراج اطلاعات</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary text-white rounded-2xl p-6">
          <p className="text-body-md">کاربران ماهانه</p>
          <p className="text-h1 font-bold mt-4">۲۱.۲k</p>
        </div>
        <div className="bg-primary text-white rounded-2xl p-6">
          <p className="text-body-md">کاربران جدید</p>
          <p className="text-h1 font-bold mt-4">۷۵۶</p>
        </div>
        <div className="bg-primary text-white rounded-2xl p-6">
          <p className="text-body-md">کاربران</p>
          <p className="text-h1 font-bold mt-4">۲.۲k</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-card-title font-semibold text-text-primary mb-4 text-right">
          گزارش‌ها
        </h3>
        <div className="h-64 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-body-md text-text-secondary">
          نمودار گزارش‌ها
        </div>
      </div>
    </div>
  )
}

export default Dashboard
