import { useState } from 'react'
import {
  emptyCommissioningProfile,
  type CommissioningProfile,
  type ControlMethod,
  type ControlUnit,
  type LoadType,
  type MotorConnection,
  type SafetyAnswer,
} from './commissioningTypes'

const controlUnits: ControlUnit[] = ['CU240B-2', 'CU240E-2']
const connections: MotorConnection[] = ['Yıldız (Y)', 'Üçgen (Δ)', 'Etikette Y/Δ birlikte verilmiş', 'Emin değilim']
const loadTypes: LoadType[] = ['Konveyör / sabit tork', 'Pompa / fan', 'Ağır kalkış', 'Sık ileri-geri çalışma', 'Hızlı hızlanma-yavaşlama', 'Genel makine', 'Emin değilim']
const controlMethods: ControlMethod[] = ['Terminal + analog 0–10 V', 'Terminal + analog 4–20 mA', 'Sabit hızlar', 'PROFINET / PLC', 'PROFIBUS / PLC', 'BOP-2 üzerinden test', 'Emin değilim']
const safetyAnswers: SafetyAnswer[] = ['Evet', 'Hayır', 'Emin değilim']

const numericValue = (value: string): number | undefined => value.trim() === '' ? undefined : Number(value)
const shownValue = (value: string | number | undefined) => value === undefined || value === '' ? '—' : String(value)

function NumericField({ label, value, onChange, unit, placeholder, required = false }: {
  label: string
  value: number | undefined
  onChange: (value: string) => void
  unit: string
  placeholder: string
  required?: boolean
}) {
  return <label>{label}{required && <span className="commissioning-required">Gerekli</span>}
    <div className="input-suffix"><input type="number" min="0" step="any" value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /><span>{unit}</span></div>
  </label>
}

function SummaryRow({ label, value }: { label: string; value: string | number | undefined }) {
  return <div className="commissioning-summary-row"><span>{label}</span><strong>{shownValue(value)}</strong></div>
}

export function QuickCommissioning() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<CommissioningProfile>(emptyCommissioningProfile)
  const [validationMessage, setValidationMessage] = useState('')

  const validate = () => {
    const measurements = [
      profile.drive.mainsVoltage, profile.motor.ratedPowerKw, profile.motor.ratedVoltageV,
      profile.motor.ratedCurrentA, profile.motor.ratedFrequencyHz, profile.motor.ratedSpeedRpm,
      profile.motor.powerFactor, profile.motor.lowVoltageV, profile.motor.highVoltageV,
      profile.motor.lowVoltageCurrentA, profile.motor.highVoltageCurrentA, profile.motion.minimumSpeedRpm,
      profile.motion.maximumSpeedRpm, profile.motion.accelerationTimeSec, profile.motion.decelerationTimeSec,
    ]
    if (measurements.some((value) => value !== undefined && (!Number.isFinite(value) || value < 0))) {
      setValidationMessage('Sayısal değerler negatif olamaz.')
      return false
    }
    if (step === 2) {
      const requiredValues = [profile.motor.ratedPowerKw, profile.motor.ratedVoltageV, profile.motor.ratedCurrentA, profile.motor.ratedFrequencyHz, profile.motor.ratedSpeedRpm]
      if (requiredValues.some((value) => value === undefined)) {
        setValidationMessage('Motor etiketi için güç, gerilim, akım, frekans ve hız alanları gereklidir.')
        return false
      }
      if (profile.motor.powerFactor !== undefined && (profile.motor.powerFactor <= 0 || profile.motor.powerFactor > 1)) {
        setValidationMessage('cos φ girildiğinde 0 değerinden büyük ve 1 değerine eşit veya küçük olmalıdır.')
        return false
      }
    }
    setValidationMessage('')
    return true
  }

  const next = () => {
    if (validate()) setStep((current) => Math.min(6, current + 1))
  }

  const previous = () => {
    setValidationMessage('')
    setStep((current) => Math.max(1, current - 1))
  }

  return <section className="commissioning-page" aria-labelledby="commissioning-title">
    <header className="page-header"><div><p className="eyebrow">HIZLI DEVREYE ALMA</p><h1 id="commissioning-title">G120 Hızlı Devreye Alma</h1><p className="subtitle">Motor etiket bilgilerini girerek adım adım devreye alma planı oluşturun.</p></div></header>
    <p className="commissioning-scope">V1 kapsamı: SINAMICS G120 CU240B-2 / CU240E-2, IEC asenkron motor ve manuel/BOP-2 devreye alma.</p>

    <div className="commissioning-progress" aria-label={`Adım ${step} / 6`}><span>Adım {step} / 6</span><div><i style={{ width: `${(step / 6) * 100}%` }} /></div></div>
    <section className="commissioning-card">
      {validationMessage && <p className="form-message error-message" role="alert">{validationMessage}</p>}
      {step === 1 && <div><div className="commissioning-heading"><h2>Sürücü</h2><p>Desteklenen sürücü kapsamını ve şebeke bilgisini doğrulayın.</p></div><div className="form-grid commissioning-fields">
        <label>ÜRETİCİ<select value={profile.drive.manufacturer} disabled><option>Siemens</option></select></label>
        <label>SÜRÜCÜ AİLESİ<select value={profile.drive.driveFamily} disabled><option>SINAMICS G120</option></select></label>
        <label>CONTROL UNIT<select value={profile.drive.controlUnit} onChange={(event) => setProfile((current) => ({ ...current, drive: { ...current.drive, controlUnit: event.target.value as ControlUnit } }))}><option value="">Seçiniz</option>{controlUnits.map((item) => <option key={item}>{item}</option>)}</select></label>
        <NumericField label="ŞEBEKE GERİLİMİ" value={profile.drive.mainsVoltage} onChange={(value) => setProfile((current) => ({ ...current, drive: { ...current.drive, mainsVoltage: numericValue(value) } }))} unit="V" placeholder="Örn: 400" />
        <label>MOTOR STANDARDI<select value={profile.drive.motorStandard} disabled><option>IEC</option></select></label>
        <label>MOTOR TİPİ<select value={profile.drive.motorType} disabled><option>Asenkron motor</option></select></label>
      </div></div>}

      {step === 2 && <div><div className="commissioning-heading"><h2>Motor Etiketi</h2><p>Değerleri motor etiketinden girin.</p></div><div className="form-grid commissioning-fields">
        <NumericField label="MOTOR NOMİNAL GÜCÜ" value={profile.motor.ratedPowerKw} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, ratedPowerKw: numericValue(value) } }))} unit="kW" placeholder="Örn: 7.5" required />
        <NumericField label="MOTOR NOMİNAL GERİLİMİ" value={profile.motor.ratedVoltageV} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, ratedVoltageV: numericValue(value) } }))} unit="V" placeholder="Örn: 400" required />
        <NumericField label="MOTOR NOMİNAL AKIMI" value={profile.motor.ratedCurrentA} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, ratedCurrentA: numericValue(value) } }))} unit="A" placeholder="Örn: 15.2" required />
        <NumericField label="MOTOR NOMİNAL FREKANSI" value={profile.motor.ratedFrequencyHz} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, ratedFrequencyHz: numericValue(value) } }))} unit="Hz" placeholder="Örn: 50" required />
        <NumericField label="MOTOR NOMİNAL HIZI" value={profile.motor.ratedSpeedRpm} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, ratedSpeedRpm: numericValue(value) } }))} unit="rpm" placeholder="Örn: 1470" required />
        <NumericField label="COS Φ" value={profile.motor.powerFactor} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, powerFactor: numericValue(value) } }))} unit="" placeholder="Örn: 0.82" />
        <label className="commissioning-full">MOTOR ETİKETİ BAĞLANTI BİLGİSİ<select value={profile.motor.connection} onChange={(event) => setProfile((current) => ({ ...current, motor: { ...current.motor, connection: event.target.value as MotorConnection } }))}><option value="">Seçiniz</option>{connections.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div><div className="commissioning-subsection"><h3>Çift gerilim etiketi <span>İsteğe bağlı</span></h3><div className="form-grid">
        <NumericField label="DÜŞÜK GERİLİM DEĞERİ" value={profile.motor.lowVoltageV} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, lowVoltageV: numericValue(value) } }))} unit="V" placeholder="Örn: 230" />
        <NumericField label="YÜKSEK GERİLİM DEĞERİ" value={profile.motor.highVoltageV} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, highVoltageV: numericValue(value) } }))} unit="V" placeholder="Örn: 400" />
        <NumericField label="DÜŞÜK GERİLİM AKIMI" value={profile.motor.lowVoltageCurrentA} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, lowVoltageCurrentA: numericValue(value) } }))} unit="A" placeholder="Örn: 26" />
        <NumericField label="YÜKSEK GERİLİM AKIMI" value={profile.motor.highVoltageCurrentA} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, highVoltageCurrentA: numericValue(value) } }))} unit="A" placeholder="Örn: 15" />
      </div></div></div>}

      {step === 3 && <div><div className="commissioning-heading"><h2>Uygulama</h2><p>Uygulama ve kontrol yaklaşımını seçin.</p></div><div className="form-grid commissioning-fields">
        <label>YÜK TİPİ<select value={profile.application.loadType} onChange={(event) => setProfile((current) => ({ ...current, application: { ...current.application, loadType: event.target.value as LoadType } }))}><option value="">Seçiniz</option>{loadTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>MOTOR NASIL KONTROL EDİLECEK?<select value={profile.application.controlMethod} onChange={(event) => setProfile((current) => ({ ...current, application: { ...current.application, controlMethod: event.target.value as ControlMethod } }))}><option value="">Seçiniz</option>{controlMethods.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div></div>}

      {step === 4 && <div><div className="commissioning-heading"><h2>Hız ve Rampalar</h2><p>Uygulama için hedef hızları ve rampa sürelerini girin.</p></div><div className="form-grid commissioning-fields">
        <NumericField label="MİNİMUM MOTOR HIZI" value={profile.motion.minimumSpeedRpm} onChange={(value) => setProfile((current) => ({ ...current, motion: { ...current.motion, minimumSpeedRpm: numericValue(value) } }))} unit="rpm" placeholder="Örn: 300" />
        <NumericField label="MAKSİMUM MOTOR HIZI" value={profile.motion.maximumSpeedRpm} onChange={(value) => setProfile((current) => ({ ...current, motion: { ...current.motion, maximumSpeedRpm: numericValue(value) } }))} unit="rpm" placeholder="Örn: 1470" />
        <NumericField label="HIZLANMA SÜRESİ" value={profile.motion.accelerationTimeSec} onChange={(value) => setProfile((current) => ({ ...current, motion: { ...current.motion, accelerationTimeSec: numericValue(value) } }))} unit="s" placeholder="Örn: 10" />
        <NumericField label="YAVAŞLAMA SÜRESİ" value={profile.motion.decelerationTimeSec} onChange={(value) => setProfile((current) => ({ ...current, motion: { ...current.motion, decelerationTimeSec: numericValue(value) } }))} unit="s" placeholder="Örn: 10" />
      </div></div>}

      {step === 5 && <div><div className="commissioning-heading"><h2>Motor Identification</h2><p>Test koşullarını yalnızca sahadaki gerçek duruma göre belirtin.</p></div><p className="commissioning-warning">Motor identification sırasında motor beklenmedik şekilde hareket edebilir. Döner test yalnızca çalışma alanı güvenliyse ve üretici prosedürlerine göre yapılmalıdır.</p><div className="form-grid commissioning-fields">
        <label>MOTOR MEKANİK YÜKTEN GÜVENLİ ŞEKİLDE AYRILABİLİR Mİ?<select value={profile.identification.loadCanBeDisconnected} onChange={(event) => setProfile((current) => ({ ...current, identification: { ...current.identification, loadCanBeDisconnected: event.target.value as SafetyAnswer } }))}><option value="">Seçiniz</option>{safetyAnswers.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>MOTOR IDENTIFICATION SIRASINDA MOTORUN DÖNMESİ GÜVENLİ Mİ?<select value={profile.identification.rotationIsSafe} onChange={(event) => setProfile((current) => ({ ...current, identification: { ...current.identification, rotationIsSafe: event.target.value as SafetyAnswer } }))}><option value="">Seçiniz</option>{safetyAnswers.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div></div>}

      {step === 6 && <div><div className="commissioning-heading"><h2>Özet</h2><p>Girilen bilgiler aşağıdadır. Bu sürüm henüz parametre önerisi üretmez.</p></div><div className="commissioning-summary">
        <article><h3>Sürücü</h3><SummaryRow label="Üretici" value={profile.drive.manufacturer} /><SummaryRow label="Sürücü ailesi" value={profile.drive.driveFamily} /><SummaryRow label="Control Unit" value={profile.drive.controlUnit} /><SummaryRow label="Şebeke gerilimi" value={profile.drive.mainsVoltage === undefined ? undefined : `${profile.drive.mainsVoltage} V`} /><SummaryRow label="Motor standardı" value={profile.drive.motorStandard} /><SummaryRow label="Motor tipi" value={profile.drive.motorType} /></article>
        <article><h3>Motor etiketi</h3><SummaryRow label="Nominal güç" value={profile.motor.ratedPowerKw === undefined ? undefined : `${profile.motor.ratedPowerKw} kW`} /><SummaryRow label="Nominal gerilim" value={profile.motor.ratedVoltageV === undefined ? undefined : `${profile.motor.ratedVoltageV} V`} /><SummaryRow label="Nominal akım" value={profile.motor.ratedCurrentA === undefined ? undefined : `${profile.motor.ratedCurrentA} A`} /><SummaryRow label="Nominal frekans" value={profile.motor.ratedFrequencyHz === undefined ? undefined : `${profile.motor.ratedFrequencyHz} Hz`} /><SummaryRow label="Nominal hız" value={profile.motor.ratedSpeedRpm === undefined ? undefined : `${profile.motor.ratedSpeedRpm} rpm`} /><SummaryRow label="cos φ" value={profile.motor.powerFactor} /><SummaryRow label="Bağlantı" value={profile.motor.connection} /><SummaryRow label="Düşük / yüksek gerilim" value={profile.motor.lowVoltageV === undefined && profile.motor.highVoltageV === undefined ? undefined : `${shownValue(profile.motor.lowVoltageV)} / ${shownValue(profile.motor.highVoltageV)} V`} /><SummaryRow label="Düşük / yüksek akım" value={profile.motor.lowVoltageCurrentA === undefined && profile.motor.highVoltageCurrentA === undefined ? undefined : `${shownValue(profile.motor.lowVoltageCurrentA)} / ${shownValue(profile.motor.highVoltageCurrentA)} A`} /></article>
        <article><h3>Uygulama</h3><SummaryRow label="Yük tipi" value={profile.application.loadType} /><h3>Kontrol yöntemi</h3><SummaryRow label="Kontrol" value={profile.application.controlMethod} /></article>
        <article><h3>Hız / rampalar</h3><SummaryRow label="Minimum hız" value={profile.motion.minimumSpeedRpm === undefined ? undefined : `${profile.motion.minimumSpeedRpm} rpm`} /><SummaryRow label="Maksimum hız" value={profile.motion.maximumSpeedRpm === undefined ? undefined : `${profile.motion.maximumSpeedRpm} rpm`} /><SummaryRow label="Hızlanma" value={profile.motion.accelerationTimeSec === undefined ? undefined : `${profile.motion.accelerationTimeSec} s`} /><SummaryRow label="Yavaşlama" value={profile.motion.decelerationTimeSec === undefined ? undefined : `${profile.motion.decelerationTimeSec} s`} /></article>
        <article><h3>Motor identification koşulları</h3><SummaryRow label="Yükten ayrılabilir mi?" value={profile.identification.loadCanBeDisconnected} /><SummaryRow label="Dönme güvenli mi?" value={profile.identification.rotationIsSafe} /></article>
      </div><div className="commissioning-plan-notice"><button type="button" disabled>Parametre Planı Oluştur</button><p>Parametre önerileri bir sonraki geliştirme aşamasında eklenecek.</p></div></div>}

      <div className="commissioning-actions"><button type="button" className="commissioning-back" onClick={previous} disabled={step === 1}>Geri</button>{step < 6 && <button type="button" className="commissioning-next" onClick={next}>Devam <b>→</b></button>}</div>
    </section>
  </section>
}
