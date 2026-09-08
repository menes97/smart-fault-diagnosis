import type { DiagnosisHistoryRecord } from '../history/diagnosisHistory'

export interface DashboardFaultCount { title: string; count: number }

const primaryTitle = (record: DiagnosisHistoryRecord) => record.manufacturerFaultResult ? `${record.manufacturerFaultResult.code} — ${record.manufacturerFaultResult.titleTr}` : record.results[0]?.title
const canonicalManufacturer = (record: DiagnosisHistoryRecord) => record.manufacturerFaultResult?.manufacturer ?? record.manufacturer ? record.manufacturerFaultResult?.manufacturer ?? record.manufacturer!.charAt(0).toUpperCase() + record.manufacturer!.slice(1) : undefined

export function getDashboardStats(records: DiagnosisHistoryRecord[]) {
  const motorCount = records.filter((record) => record.equipmentType === 'Üç Fazlı Elektrik Motoru').length
  const vfdRecords = records.filter((record) => record.equipmentType === 'Frekans Konvertörü / VFD')
  const manufacturerDistribution = new Map<string, number>()
  const commonFaults = new Map<string, number>()
  records.forEach((record) => {
    const manufacturer = canonicalManufacturer(record)
    if (record.equipmentType === 'Frekans Konvertörü / VFD' && manufacturer) manufacturerDistribution.set(manufacturer, (manufacturerDistribution.get(manufacturer) ?? 0) + 1)
    const title = primaryTitle(record)
    if (title) commonFaults.set(title, (commonFaults.get(title) ?? 0) + 1)
  })
  return {
    total: records.length,
    motorCount,
    vfdCount: vfdRecords.length,
    verifiedFaultCount: records.filter((record) => Boolean(record.manufacturerFaultResult)).length,
    recentRecords: records.slice(0, 5),
    recentVerifiedFaults: records.filter((record) => Boolean(record.manufacturerFaultResult)).slice(0, 5),
    commonFaults: [...commonFaults.entries()].map(([title, count]) => ({ title, count })).sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, 'tr')).slice(0, 5),
    manufacturerDistribution: [...manufacturerDistribution.entries()].map(([title, count]) => ({ title, count })).sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, 'tr')),
  }
}

export const getPrimaryHistoryTitle = primaryTitle
export const getCanonicalManufacturer = canonicalManufacturer
