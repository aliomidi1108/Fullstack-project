const reports = []
let nextReportId = 1

const generateReport = ({ title, type, data, generatedBy }) => {
  const report = {
    id: nextReportId,
    title: String(title || '').trim(),
    type: String(type || '').trim(),
    data: data || {},
    generatedBy: Number(generatedBy) || null,
    generatedAt: new Date().toISOString(),
  }
  reports.unshift(report)
  nextReportId += 1
  return { ...report }
}

const listReports = () => reports.map((report) => ({ ...report }))

export { generateReport, listReports }
