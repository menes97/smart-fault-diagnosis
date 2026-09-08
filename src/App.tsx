import { useState } from 'react'
import {
  diagnoseMotor,
  MOTOR_EQUIPMENT,
  type DiagnosisResult,
  type MotorSymptom,
} from './diagnosis/motorDiagnosis'
import {
  diagnoseVfd,
  VFD_EQUIPMENT,
  type VfdVoltageClass,
  type VfdSymptom,
} from './diagnosis/vfdDiagnosis'
import {
  lookupManufacturerFaultCode,
  type ManufacturerFaultCode,
  type VfdManufacturer,
  type VfdModelFamily,
} from './diagnosis/vfdFaultCodes'
import './App.css'

const equipmentOptions = [MOTOR_EQUIPMENT, VFD_EQUIPMENT, 'Endüstriyel Sensör']
const motorSymptoms: MotorSymptom[] = ['Motor ısınıyor', 'Akım nominal değerin üzerinde', 'Mekanik ses var', 'Motor dönmüyor', 'Sigorta açıyor', 'Titreşim artmış']
const vfdSymptoms: VfdSymptom[] = ['Drive trip ediyor', 'Motor çalışmıyor', 'Motor düşük hızda çalışıyor', 'Motor aşırı akım çekiyor', 'Drive aşırı ısınıyor', 'Haberleşme hatası var', 'Hız referansı gelmiyor', 'Drive hazır değil']
type IconName = 'dashboard' | 'diagnosis' | 'history' | 'library' | 'settings'

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    diagnosis: <><path d="M12 2v4" /><path d="m15.5 7.5 2.8-2.8" /><path d="M18 12h4" /><path d="m15.5 16.5 2.8 2.8" /><path d="M12 18v4" /><path d="m8.5 16.5-2.8 2.8" /><path d="M6 12H2" /><path d="m8.5 7.5-2.8-2.8" /><circle cx="12" cy="12" r="4" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></>,
    library: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.1 2.1-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20.3h-3v-.1A1.7 1.7 0 0 0 10.75 18.65a1.7 1.7 0 0 0-1.88.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 0 0 7.1 15a1.7 1.7 0 0 0-1.55-1H5.4v-3h.15A1.7 1.7 0 0 0 7.1 10a1.7 1.7 0 0 0-.34-1.88L6.7 8.06l2.1-2.1.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V4.7h3v.1a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.1 2.1-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.55 1h.15v3h-.15a1.7 1.7 0 0 0-1.55 1Z" /></>,
  }
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{paths[name]}</svg>
}

function App() {
  const [equipment, setEquipment] = useState('')
  const [brandModel, setBrandModel] = useState('')
  const [motorSelectedSymptoms, setMotorSelectedSymptoms] = useState<MotorSymptom[]>([])
  const [vfdSelectedSymptoms, setVfdSelectedSymptoms] = useState<VfdSymptom[]>([])
  const [nominalCurrent, setNominalCurrent] = useState('')
  const [measuredCurrent, setMeasuredCurrent] = useState('')
  const [l1Current, setL1Current] = useState('')
  const [l2Current, setL2Current] = useState('')
  const [l3Current, setL3Current] = useState('')
  const [l1L2Voltage, setL1L2Voltage] = useState('')
  const [l2L3Voltage, setL2L3Voltage] = useState('')
  const [l3L1Voltage, setL3L1Voltage] = useState('')
  const [motorTemperature, setMotorTemperature] = useState('')
  const [vibration, setVibration] = useState('')
  const [faultCode, setFaultCode] = useState('')
  const [vfdManufacturer, setVfdManufacturer] = useState<VfdManufacturer | ''>('')
  const [vfdModelFamily, setVfdModelFamily] = useState<VfdModelFamily | ''>('')
  const [manufacturerFault, setManufacturerFault] = useState<ManufacturerFaultCode | null>(null)
  const [unknownFaultCode, setUnknownFaultCode] = useState(false)
  const [vfdVoltageClass, setVfdVoltageClass] = useState<VfdVoltageClass>('unknown')
  const [dcBusVoltage, setDcBusVoltage] = useState('')
  const [outputCurrent, setOutputCurrent] = useState('')
  const [motorNominalCurrent, setMotorNominalCurrent] = useState('')
  const [outputFrequency, setOutputFrequency] = useState('')
  const [driveTemperature, setDriveTemperature] = useState('')
  const [results, setResults] = useState<DiagnosisResult[] | null>(null)
  const [validationMessage, setValidationMessage] = useState('')
  const [measurementWarning, setMeasurementWarning] = useState('')
  const [measurementInfo, setMeasurementInfo] = useState<string[]>([])
  const navItems: { label: string; icon: IconName; active?: boolean }[] = [
    { label: 'Dashboard', icon: 'dashboard' }, { label: 'Yeni Teşhis', icon: 'diagnosis', active: true },
    { label: 'Arıza Geçmişi', icon: 'history' }, { label: 'Bilgi Bankası', icon: 'library' }, { label: 'Ayarlar', icon: 'settings' },
  ]
  const parseMeasurement = (value: string): number | undefined => value.trim() === '' ? undefined : Number(value)
  const isProvidedMeasurement = (value: number | undefined | null): value is number => value !== undefined && value !== null
  const isVfd = equipment === VFD_EQUIPMENT
  const isSupportedEquipment = equipment === MOTOR_EQUIPMENT || isVfd
  const toggleMotorSymptom = (symptom: MotorSymptom) => setMotorSelectedSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom])
  const toggleVfdSymptom = (symptom: VfdSymptom) => setVfdSelectedSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom])

  const analyze = () => {
    setMeasurementWarning('')
    setMeasurementInfo([])
    if (isVfd) {
      const values = {
        dcBusVoltage: parseMeasurement(dcBusVoltage), outputCurrent: parseMeasurement(outputCurrent),
        motorNominalCurrent: parseMeasurement(motorNominalCurrent), outputFrequency: parseMeasurement(outputFrequency),
        driveTemperature: parseMeasurement(driveTemperature),
      }
      if (values.motorNominalCurrent !== undefined && (!Number.isFinite(values.motorNominalCurrent) || values.motorNominalCurrent <= 0)) {
        setValidationMessage('Motor nominal akımı girildiğinde 0 A değerinden büyük olmalıdır.')
        return
      }
      const invalid = Object.entries(values).find(([, value]) => value !== undefined && (!Number.isFinite(value) || value < 0))
      if (invalid) {
        setValidationMessage('VFD ölçüm değerleri negatif olamaz.')
        return
      }
      setValidationMessage('')
      setMeasurementWarning(
        vfdSelectedSymptoms.includes('Motor aşırı akım çekiyor') &&
        values.outputCurrent !== undefined && values.motorNominalCurrent !== undefined &&
        values.outputCurrent <= values.motorNominalCurrent
          ? '“Motor aşırı akım çekiyor” belirtisi, girilen akım ölçümüyle çelişiyor. Hesaplamada ölçüm verisi önceliklidir.'
          : '',
      )
      const matchedFault = faultCode.trim()
        ? lookupManufacturerFaultCode(vfdManufacturer, vfdModelFamily, faultCode)
        : undefined
      setManufacturerFault(matchedFault ?? null)
      setUnknownFaultCode(faultCode.trim() !== '' && !matchedFault)
      setResults(diagnoseVfd({ equipment, symptoms: vfdSelectedSymptoms, faultCode: faultCode.trim() || undefined, voltageClass: vfdVoltageClass, ...values }).slice(0, 3))
      return
    }

    const values = {
      nominalCurrent: parseMeasurement(nominalCurrent), measuredCurrent: parseMeasurement(measuredCurrent),
      l1Current: parseMeasurement(l1Current), l2Current: parseMeasurement(l2Current), l3Current: parseMeasurement(l3Current),
      l1L2Voltage: parseMeasurement(l1L2Voltage), l2L3Voltage: parseMeasurement(l2L3Voltage), l3L1Voltage: parseMeasurement(l3L1Voltage),
      motorTemperature: parseMeasurement(motorTemperature), vibration: parseMeasurement(vibration),
    }
    const nonNegativeFields: Array<[string, number | undefined]> = [
      ['Ölçülen akım', values.measuredCurrent], ['L1 akımı', values.l1Current], ['L2 akımı', values.l2Current], ['L3 akımı', values.l3Current],
      ['L1-L2 gerilimi', values.l1L2Voltage], ['L2-L3 gerilimi', values.l2L3Voltage], ['L3-L1 gerilimi', values.l3L1Voltage],
      ['Motor sıcaklığı', values.motorTemperature], ['Titreşim', values.vibration],
    ]
    if (values.nominalCurrent !== undefined && (!Number.isFinite(values.nominalCurrent) || values.nominalCurrent <= 0)) {
      setValidationMessage('Nominal akım girildiğinde 0 A değerinden büyük olmalıdır.')
      return
    }
    const invalidField = nonNegativeFields.find(([, value]) => value !== undefined && (!Number.isFinite(value) || value < 0))
    if (invalidField) {
      setValidationMessage(`${invalidField[0]} negatif olamaz.`)
      return
    }
    setValidationMessage('')
    const hasPartialMeasurement = (measurements: Array<number | undefined>) => measurements.some(isProvidedMeasurement) && measurements.some((value) => !isProvidedMeasurement(value))
    setMeasurementInfo([
      ...(hasPartialMeasurement([values.l1Current, values.l2Current, values.l3Current]) ? ['Faz akımı dengesizliği analizi için L1, L2 ve L3 akımlarının birlikte girilmesi gerekir.'] : []),
      ...(hasPartialMeasurement([values.l1L2Voltage, values.l2L3Voltage, values.l3L1Voltage]) ? ['Gerilim dengesizliği analizi için L1-L2, L2-L3 ve L3-L1 gerilimlerinin birlikte girilmesi gerekir.'] : []),
    ])
    setMeasurementWarning(
      motorSelectedSymptoms.includes('Akım nominal değerin üzerinde') && values.nominalCurrent !== undefined &&
      values.measuredCurrent !== undefined && values.measuredCurrent <= values.nominalCurrent
        ? '“Akım nominal değerin üzerinde” belirtisi, girilen akım ölçümüyle çelişiyor. Hesaplamada ölçüm verisi önceliklidir.'
        : '',
    )
    setManufacturerFault(null)
    setUnknownFaultCode(false)
    setResults(diagnoseMotor({
      equipment, symptoms: motorSelectedSymptoms, nominalCurrent: values.nominalCurrent, measuredCurrent: values.measuredCurrent,
      phaseMeasurements: { l1Current: values.l1Current, l2Current: values.l2Current, l3Current: values.l3Current, l1L2Voltage: values.l1L2Voltage, l2L3Voltage: values.l2L3Voltage, l3L1Voltage: values.l3L1Voltage },
      motorTemperature: values.motorTemperature, vibration: values.vibration,
    }).slice(0, 3))
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">⚡</span><span>AKILLI ARIZA<br /><strong>TEŞHİS SİSTEMİ</strong></span></div>
      <nav aria-label="Ana menü">{navItems.map((item) => <button className={`nav-item ${item.active ? 'active' : ''}`} key={item.label} type="button"><Icon name={item.icon} />{item.label}</button>)}</nav>
      <div className="sidebar-footer"><span className="status-dot" />Sistem çevrimiçi</div>
    </aside>
    <main className="main-content">
      <header className="page-header"><div><p className="eyebrow">TEŞHİS MERKEZİ</p><h1>Yeni Arıza Teşhisi</h1><p className="subtitle">Ekipman bilgilerini girin, sistem olası arızaları değerlendirsin.</p></div><div className="header-date">08 Eylül 2026 <span>•</span> Salı</div></header>
      <div className="workspace">
        <section className="form-card" aria-labelledby="form-title">
          <div className="card-heading"><div className="heading-icon">⌁</div><div><h2 id="form-title">{isVfd ? 'VFD Bilgileri' : 'Ekipman Bilgileri'}</h2><p>Teşhis için gerekli alanları doldurun.</p></div></div>
          {validationMessage && <p className="form-message error-message" role="alert">{validationMessage}</p>}
          {measurementWarning && <p className="form-message warning-message" role="status">{measurementWarning}</p>}
          {measurementInfo.map((message) => <p className="form-message info-message" role="status" key={message}>{message}</p>)}
          <form onSubmit={(event) => { event.preventDefault(); analyze() }}>
            <div className="form-grid"><label>EKİPMAN TÜRÜ<select value={equipment} onChange={(event) => { setEquipment(event.target.value); setResults(null); setManufacturerFault(null); setUnknownFaultCode(false) }}><option value="" disabled>Ekipman seçiniz</option>{equipmentOptions.map((option) => <option key={option}>{option}</option>)}</select></label>{isVfd ? <label>ÜRETİCİ<select value={vfdManufacturer} onChange={(event) => { const manufacturer = event.target.value as VfdManufacturer | ''; setVfdManufacturer(manufacturer); setVfdModelFamily(manufacturer === 'siemens' ? 'SINAMICS G120' : manufacturer === 'yaskawa' ? 'V1000' : manufacturer === 'danfoss' ? 'VLT AutomationDrive FC 302' : '') }}><option value="">Seçiniz</option><option value="siemens">Siemens</option><option value="yaskawa">Yaskawa</option><option value="danfoss">Danfoss</option></select></label> : <label>MARKA / MODEL<input value={brandModel} onChange={(event) => setBrandModel(event.target.value)} placeholder="Örn: Siemens 1LE1001" /></label>}</div>
            {!isVfd && <><label className="full-field">PROBLEM TANIMI<textarea rows={3} placeholder="Gözlemlediğiniz problemi kısaca açıklayın..." /></label><fieldset><legend>BELİRTİLER <span>Uygun olanları seçin</span></legend><div className="symptoms">{motorSymptoms.map((symptom) => <label className="checkbox-label" key={symptom}><input type="checkbox" checked={motorSelectedSymptoms.includes(symptom)} onChange={() => toggleMotorSymptom(symptom)} /><span className="checkmark">✓</span>{symptom}</label>)}</div></fieldset><div className="form-grid electrical-fields"><label>NOMİNAL AKIM <div className="input-suffix"><input type="number" value={nominalCurrent} onChange={(event) => setNominalCurrent(event.target.value)} placeholder="Örn: 10" min="0" step="0.01" /><span>A</span></div></label><label>ÖLÇÜLEN AKIM <div className="input-suffix"><input type="number" value={measuredCurrent} onChange={(event) => setMeasuredCurrent(event.target.value)} placeholder="Örn: 12" min="0" step="0.01" /><span>A</span></div></label></div><fieldset className="measurement-section"><legend>FAZ ÖLÇÜMLERİ <span>İsteğe bağlı</span></legend><div className="measurement-grid"><label>L1 AKIM <div className="input-suffix"><input type="number" value={l1Current} onChange={(event) => setL1Current(event.target.value)} placeholder="Örn: 8.5" min="0" step="0.01" /><span>A</span></div></label><label>L2 AKIM <div className="input-suffix"><input type="number" value={l2Current} onChange={(event) => setL2Current(event.target.value)} placeholder="Örn: 8.5" min="0" step="0.01" /><span>A</span></div></label><label>L3 AKIM <div className="input-suffix"><input type="number" value={l3Current} onChange={(event) => setL3Current(event.target.value)} placeholder="Örn: 8.5" min="0" step="0.01" /><span>A</span></div></label></div><div className="measurement-grid"><label>L1-L2 GERİLİM <div className="input-suffix"><input type="number" value={l1L2Voltage} onChange={(event) => setL1L2Voltage(event.target.value)} placeholder="Örn: 400" min="0" step="0.1" /><span>V</span></div></label><label>L2-L3 GERİLİM <div className="input-suffix"><input type="number" value={l2L3Voltage} onChange={(event) => setL2L3Voltage(event.target.value)} placeholder="Örn: 400" min="0" step="0.1" /><span>V</span></div></label><label>L3-L1 GERİLİM <div className="input-suffix"><input type="number" value={l3L1Voltage} onChange={(event) => setL3L1Voltage(event.target.value)} placeholder="Örn: 400" min="0" step="0.1" /><span>V</span></div></label></div></fieldset><div className="form-grid auxiliary-measurements"><label>MOTOR SICAKLIĞI <div className="input-suffix"><input type="number" value={motorTemperature} onChange={(event) => setMotorTemperature(event.target.value)} placeholder="Örn: 65" min="0" step="0.1" /><span>°C</span></div></label><label>TİTREŞİM <div className="input-suffix"><input type="number" value={vibration} onChange={(event) => setVibration(event.target.value)} placeholder="Örn: 3.2" min="0" step="0.1" /><span>mm/s</span></div></label></div></>}
            {isVfd && <><div className="form-grid vfd-model-field"><label>MODEL AİLESİ <select value={vfdModelFamily} onChange={(event) => setVfdModelFamily(event.target.value as VfdModelFamily | '')} disabled={!vfdManufacturer}><option value="">Seçiniz</option>{vfdManufacturer === 'siemens' && <option value="SINAMICS G120">SINAMICS G120</option>}{vfdManufacturer === 'yaskawa' && <option value="V1000">V1000</option>}{vfdManufacturer === 'danfoss' && <option value="VLT AutomationDrive FC 302">VLT AutomationDrive FC 302</option>}</select></label><label>ARIZA KODU <input value={faultCode} onChange={(event) => setFaultCode(event.target.value)} placeholder="İsteğe bağlı; örn: F0001" /></label></div><fieldset><legend>VFD BELİRTİLERİ <span>Uygun olanları seçin</span></legend><div className="symptoms">{vfdSymptoms.map((symptom) => <label className="checkbox-label" key={symptom}><input type="checkbox" checked={vfdSelectedSymptoms.includes(symptom)} onChange={() => toggleVfdSymptom(symptom)} /><span className="checkmark">✓</span>{symptom}</label>)}</div></fieldset><fieldset className="measurement-section"><legend>VFD ÖLÇÜMLERİ <span>İsteğe bağlı</span></legend><div className="form-grid"><label>GERİLİM SINIFI <select value={vfdVoltageClass} onChange={(event) => setVfdVoltageClass(event.target.value as VfdVoltageClass)}><option value="unknown">Bilinmiyor</option><option value="230">230 V Class</option><option value="400">400 V Class</option><option value="480">480 V Class</option></select></label><label>DC BARA GERİLİMİ <div className="input-suffix"><input type="number" value={dcBusVoltage} onChange={(event) => setDcBusVoltage(event.target.value)} placeholder="Örn: 600" min="0" step="0.1" /><span>V</span></div></label><label>ÇIKIŞ AKIMI <div className="input-suffix"><input type="number" value={outputCurrent} onChange={(event) => setOutputCurrent(event.target.value)} placeholder="Örn: 12" min="0" step="0.01" /><span>A</span></div></label><label>MOTOR NOMİNAL AKIMI <div className="input-suffix"><input type="number" value={motorNominalCurrent} onChange={(event) => setMotorNominalCurrent(event.target.value)} placeholder="Örn: 10" min="0" step="0.01" /><span>A</span></div></label><label>ÇIKIŞ FREKANSI <div className="input-suffix"><input type="number" value={outputFrequency} onChange={(event) => setOutputFrequency(event.target.value)} placeholder="Örn: 50" min="0" step="0.1" /><span>Hz</span></div></label><label>SÜRÜCÜ SICAKLIĞI <div className="input-suffix"><input type="number" value={driveTemperature} onChange={(event) => setDriveTemperature(event.target.value)} placeholder="Örn: 65" min="0" step="0.1" /><span>°C</span></div></label></div></fieldset></>}
            <button className="analyze-button" type="submit"><span>⌁</span> ARIZAYI ANALİZ ET <b>→</b></button>
          </form>
        </section>
        <aside className="result-card" aria-label="Teşhis sonucu">
          <div className="result-heading"><span className="result-icon">◈</span><div><p className="eyebrow">ANALİZ ÇIKTISI</p><h2>Teşhis Sonucu</h2></div></div>
          <p className="safety-warning">Elektrik ekipmanlarında kontrol veya müdahale öncesinde enerjiyi güvenli şekilde kesin ve tesis prosedürlerini uygulayın.</p>
          {manufacturerFault && <article className="manufacturer-fault-card"><p className="manufacturer-label">ÜRETİCİ HATA KODU</p><h3>{manufacturerFault.titleTr}</h3><div className="manufacturer-meta"><span>{manufacturerFault.manufacturer}</span><span>{manufacturerFault.modelFamily}</span><strong>{manufacturerFault.code}</strong></div><p>{manufacturerFault.description}</p><div className="checks"><strong>Önerilen kontroller</strong><ul>{manufacturerFault.recommendedChecks.map((check) => <li key={check}>{check}</li>)}</ul></div><a href={manufacturerFault.sourceUrl} target="_blank" rel="noreferrer">Kaynak: {manufacturerFault.sourceName}</a></article>}
          {unknownFaultCode && <p className="unknown-code-message">Bu hata kodu mevcut doğrulanmış hata kodu veritabanında bulunamadı.<br />Kodun anlamı tahmin edilmedi.</p>}
          {results === null && <div className="result-placeholder"><div className="placeholder-icon">⌁</div><p>Teşhis sonucu burada<br />görüntülenecek.</p><span>Formu doldurup analizi başlatın.</span></div>}
          {results !== null && !isSupportedEquipment && <div className="result-placeholder"><p>Bu sürümde seçilen ekipman türü için teşhis desteklenmemektedir.</p></div>}
          {results !== null && isSupportedEquipment && results.length === 0 && <div className="result-placeholder"><p>Seçilen bilgilerle eşleşen bir kural bulunamadı.</p><span>Belirtileri ve ölçüm değerlerini gözden geçirin.</span></div>}
          {results && results.length > 0 && <div className="diagnosis-results">{results.map((result) => <article className="diagnosis-result" key={result.id}><div className="result-title"><h3>{result.title}</h3><span>Eşleşme: {result.score}/100</span></div><p>{result.description}</p><div className="score-reasons"><strong>Neden eşleşti?</strong><ul>{result.scoringReasons.map((reason) => <li key={reason.label}><span>{reason.label}</span><b>+{reason.points}</b></li>)}</ul></div>{result.observations.length > 0 && <div className="observations"><strong>Ölçüm notları</strong><ul>{result.observations.map((observation) => <li key={observation.label}>ℹ {observation.label}</li>)}</ul></div>}<div className="checks"><strong>Önerilen kontroller</strong><ul>{result.recommendedChecks.map((check) => <li key={check}>{check}</li>)}</ul></div>{result.safetyNotes && <p className="fault-safety">{result.safetyNotes[0]}</p>}</article>)}</div>}
        </aside>
      </div>
    </main>
  </div>
}
export default App
