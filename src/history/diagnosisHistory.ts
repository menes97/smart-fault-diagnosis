export const diagnosisHistoryStorageKey = 'smart-fault-diagnosis.history.v1'

export type DiagnosisHistorySourceContext = 'manual-diagnosis' | 'commissioning-first-run'

export interface DiagnosisHistoryResult {
  id: string
  title: string
  score: number
}

export interface ManufacturerFaultHistoryResult {
  code: string
  titleTr: string
  manufacturer: string
  modelFamily: string
}

export interface DiagnosisHistoryRecord {
  id: string
  createdAt: string
  equipmentType: string
  manufacturer?: string
  modelFamily?: string
  brandModel?: string
  faultCode?: string
  symptoms: string[]
  measurements: Record<string, string | number>
  results: DiagnosisHistoryResult[]
  manufacturerFaultResult?: ManufacturerFaultHistoryResult
  sourceContext: DiagnosisHistorySourceContext
}

const isRecord = (value: unknown): value is DiagnosisHistoryRecord => {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<DiagnosisHistoryRecord>
  return typeof record.id === 'string' && typeof record.createdAt === 'string' && typeof record.equipmentType === 'string' && Array.isArray(record.symptoms) && Array.isArray(record.results)
}

export function loadDiagnosisHistory(): DiagnosisHistoryRecord[] {
  try {
    const stored = window.localStorage.getItem(diagnosisHistoryStorageKey)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isRecord).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []
  } catch {
    console.warn('Teşhis geçmişi okunamadı; boş geçmiş kullanılacak.')
    return []
  }
}

export function persistDiagnosisHistory(records: DiagnosisHistoryRecord[]) {
  window.localStorage.setItem(diagnosisHistoryStorageKey, JSON.stringify(records))
}
