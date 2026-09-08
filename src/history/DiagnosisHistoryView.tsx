import { useMemo, useState } from 'react'
import type { DiagnosisHistoryRecord } from './diagnosisHistory'

const equipmentOptions = ['Tümü', 'Üç Fazlı Elektrik Motoru', 'Frekans Konvertörü / VFD']
const measurementLabels: Record<string, string> = {
  nominalCurrent: 'Nominal akım', measuredCurrent: 'Ölçülen akım', l1Current: 'L1 akımı', l2Current: 'L2 akımı', l3Current: 'L3 akımı',
  l1L2Voltage: 'L1-L2 gerilimi', l2L3Voltage: 'L2-L3 gerilimi', l3L1Voltage: 'L3-L1 gerilimi', motorTemperature: 'Motor sıcaklığı', vibration: 'Titreşim',
  voltageClass: 'Gerilim sınıfı', dcBusVoltage: 'DC bara gerilimi', outputCurrent: 'Çıkış akımı', motorNominalCurrent: 'Motor nominal akımı', outputFrequency: 'Çıkış frekansı', driveTemperature: 'Sürücü sıcaklığı',
}

const formatDate = (value: string) => new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

export function DiagnosisHistoryView({ records, onReopen, onDelete, onClear, onNewDiagnosis }: {
  records: DiagnosisHistoryRecord[]
  onReopen: (record: DiagnosisHistoryRecord) => void
  onDelete: (id: string) => void
  onClear: () => void
  onNewDiagnosis: () => void
}) {
  const [equipmentFilter, setEquipmentFilter] = useState('Tümü')
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const filteredRecords = useMemo(() => records.filter((record) => {
    const matchesEquipment = equipmentFilter === 'Tümü' || record.equipmentType === equipmentFilter
    const searchText = [record.equipmentType, record.manufacturer, record.modelFamily, record.faultCode, ...record.results.map((result) => result.title)].join(' ').toLocaleLowerCase('tr-TR')
    return matchesEquipment && searchText.includes(query.trim().toLocaleLowerCase('tr-TR'))
  }), [equipmentFilter, query, records])

  return <section className="history-page" aria-labelledby="history-title">
    <header className="page-header"><div><p className="eyebrow">TEŞHİS KAYITLARI</p><h1 id="history-title">Arıza Geçmişi</h1><p className="subtitle">Kaydedilmiş teşhis sonuçlarını görüntüleyin ve yeniden inceleyin.</p></div></header>
    <div className="history-toolbar"><input aria-label="Geçmişte ara" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Geçmişte ara..." /><select aria-label="Ekipman filtresi" value={equipmentFilter} onChange={(event) => setEquipmentFilter(event.target.value)}>{equipmentOptions.map((option) => <option key={option}>{option}</option>)}</select>{records.length > 0 && <button type="button" className="history-clear-button" onClick={() => setConfirmClear(true)}>Tüm Geçmişi Temizle</button>}</div>
    {confirmClear && <div className="history-confirmation"><p>Tüm teşhis geçmişi kalıcı olarak bu tarayıcıdan silinecek.</p><button type="button" onClick={() => { onClear(); setConfirmClear(false) }}>Sil</button><button type="button" onClick={() => setConfirmClear(false)}>İptal</button></div>}
    {records.length === 0 ? <div className="history-empty"><p>Henüz kaydedilmiş teşhis bulunmuyor.</p><button type="button" className="open-diagnosis-button" onClick={onNewDiagnosis}>Yeni Teşhis Oluştur</button></div> : <div className="history-list">{filteredRecords.map((record) => {
      const topResult = record.results[0]
      return <article className="history-card" key={record.id}><div className="history-card-top"><div><time>{formatDate(record.createdAt)}</time><h2>{record.equipmentType}</h2>{(record.manufacturer || record.modelFamily || record.brandModel) && <p>{[record.manufacturer, record.modelFamily, record.brandModel].filter(Boolean).join(' · ')}</p>}{record.faultCode && <code>{record.faultCode}</code>}</div>{topResult && <div className="history-top-result"><strong>{topResult.title}</strong><span>Eşleşme: {topResult.score}/100</span></div>}</div>{record.symptoms.length > 0 && <p className="history-symptoms"><b>Belirtiler:</b> {record.symptoms.join(' · ')}</p>}<div className="history-actions"><button type="button" onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}>Ayrıntıları Gör</button><button type="button" onClick={() => onReopen(record)}>Yeniden Aç</button><button type="button" className="history-delete-button" onClick={() => setDeleteId(record.id)}>Sil</button></div>{deleteId === record.id && <div className="history-confirmation"><p>Bu geçmiş kaydını silmek istediğinize emin misiniz?</p><button type="button" onClick={() => { onDelete(record.id); setDeleteId(null) }}>Sil</button><button type="button" onClick={() => setDeleteId(null)}>İptal</button></div>}{expandedId === record.id && <div className="history-detail"><p><b>Tarih:</b> {formatDate(record.createdAt)}</p><p><b>Ekipman:</b> {record.equipmentType}</p>{record.manufacturer && <p><b>Üretici / model:</b> {[record.manufacturer, record.modelFamily].filter(Boolean).join(' / ')}</p>}{record.brandModel && <p><b>Marka / model:</b> {record.brandModel}</p>}{record.faultCode && <p><b>Hata kodu:</b> {record.faultCode}</p>}<p><b>Belirtiler:</b> {record.symptoms.length ? record.symptoms.join(', ') : '—'}</p>{Object.keys(record.measurements).length > 0 && <div><b>Ölçümler</b><dl>{Object.entries(record.measurements).map(([key, value]) => <div key={key}><dt>{measurementLabels[key] ?? key}</dt><dd>{String(value)}</dd></div>)}</dl></div>}<div><b>Kaydedilmiş sonuçlar</b><ul>{record.results.map((result) => <li key={result.id}>{result.title} — Eşleşme: {result.score}/100</li>)}</ul></div>{record.manufacturerFaultResult && <p><b>Üretici hata kodu:</b> {record.manufacturerFaultResult.code} — {record.manufacturerFaultResult.titleTr} ({record.manufacturerFaultResult.manufacturer} / {record.manufacturerFaultResult.modelFamily})</p>}{record.sourceContext === 'commissioning-first-run' && <p className="history-source-context">Bu teşhis G120 İlk Çalıştırma Kontrolü üzerinden başlatıldı.</p>}</div>}</article>
    })}{filteredRecords.length === 0 && <p className="no-knowledge-results">Aramanızla eşleşen kaydedilmiş teşhis bulunamadı.</p>}</div>}
  </section>
}
