import { generateReport, listReports } from '../services/report.service.js'

const generateReportHandler = async (req, res) => {
  try {
    const { title, type, data } = req.body || {}
    if (!title || !type) {
      return res.status(400).json({ message: 'Invalid payload' })
    }
    const report = generateReport({
      title,
      type,
      data,
      generatedBy: req.user?.id,
    })
    return res.status(201).json(report)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const listReportsHandler = async (req, res) => {
  try {
    return res.json(listReports())
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export { generateReportHandler as generateReport, listReportsHandler as listReports }
