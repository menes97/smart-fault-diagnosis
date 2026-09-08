import { useState } from 'react'
import {
  emptyCommissioningProfile,
  type CommissioningProfile,
  type ControlMethod,
  type ControlUnit,
  type DualVoltageConnection,
  type LoadType,
  type MotorConnection,
  type SafetyAnswer,
} from './commissioningTypes'
import {
  createCommissioningParameterPlan,
  type CommissioningParameterPlan,
  type CommissioningParameterRecommendation,
} from './commissioningPlan'
import { evaluateMotorConnectionConsistency, type MotorConnectionConsistency } from './motorConnectionConsistency'
import { manufacturerFaultCodes } from '../diagnosis/vfdFaultCodes'

const controlUnits: ControlUnit[] = ['CU240B-2', 'CU240E-2', 'CU240E-2 F', 'CU240E-2 DP', 'CU240E-2 DP-F', 'CU240E-2 PN', 'CU240E-2 PN-F']
const connections: MotorConnection[] = ['Yıldız (Y)', 'Üçgen (Δ)', 'Etikette Y/Δ birlikte verilmiş', 'Emin değilim']
const loadTypes: LoadType[] = ['Konveyör / sabit tork', 'Pompa / fan', 'Ağır kalkış', 'Sık ileri-geri çalışma', 'Hızlı hızlanma-yavaşlama', 'Genel makine', 'Emin değilim']
const controlMethods: ControlMethod[] = ['Terminal + analog 0–10 V', 'Terminal + analog 4–20 mA', 'Sabit hızlar', 'PROFINET / PLC', 'PROFIBUS / PLC', 'BOP-2 üzerinden test', 'Emin değilim']
const safetyAnswers: SafetyAnswer[] = ['Evet', 'Hayır', 'Emin değilim']
const dualVoltageConnections: { value: DualVoltageConnection; label: string }[] = [{ value: 'Delta', label: 'Δ' }, { value: 'Star', label: 'Y' }, { value: 'Unknown', label: 'Bilinmiyor' }]

const numericValue = (value: string): number | undefined => value.trim() === '' ? undefined : Number(value)
const shownValue = (value: string | number | undefined) => value === undefined || value === '' ? '—' : String(value)

export interface FirstRunDiagnosisHandoff {
  ratedCurrentA?: number
  observedCurrentA?: number
  mechanicalNoise: SafetyAnswer
  vibration: SafetyAnswer
  unexpectedHeating: SafetyAnswer
}

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

const categoryOrder = ['Devreye Alma', 'Motor Etiketi', 'Hız / Rampalar', 'Kumanda / Kontrol', 'Kumanda ve Analog Hız Referansı', 'PROFINET / PLC Kumandası', 'Devreye Almayı Tamamlama', 'Motor Identification'] as const

function ParameterRecommendation({ recommendation }: { recommendation: CommissioningParameterRecommendation }) {
  const [copied, setCopied] = useState<'code' | 'value' | null>(null)
  const badge = recommendation.confidence === 'verified-direct' ? 'Doğrudan doğrulandı' : recommendation.confidence === 'conditional' ? 'Doğrulama gerekli' : 'Bilgi gerekli'
  const copy = async (kind: 'code' | 'value') => {
    await navigator.clipboard.writeText(kind === 'code' ? recommendation.code : String(recommendation.value))
    setCopied(kind)
    window.setTimeout(() => setCopied(null), 1800)
  }
  return <article className="parameter-recommendation">
    <div className="parameter-recommendation-top"><div><div className="parameter-code-row"><code>{recommendation.code}</code><button type="button" className="parameter-copy-button" onClick={() => void copy('code')}>{copied === 'code' ? 'Kopyalandı' : 'Kodu Kopyala'}</button></div><h4>{recommendation.nameTr}</h4></div><span className={`parameter-status ${recommendation.confidence}`}>{badge}</span></div>
    <div className="parameter-value-row"><p className="parameter-value">{recommendation.value}{recommendation.unit && ` ${recommendation.unit}`}</p><button type="button" className="parameter-copy-button" onClick={() => void copy('value')}>{copied === 'value' ? 'Kopyalandı' : 'Değeri Kopyala'}</button></div>
    <p><strong>Neden:</strong> {recommendation.explanationTr}</p>
    {recommendation.warningTr && <p className="parameter-warning">{recommendation.warningTr}</p>}
    {recommendation.requiresUserConfirmation && <small>Kullanıcı doğrulaması gerekir.</small>}
  </article>
}

function ParameterPlan({ plan, onOpenKnowledgeBase }: { plan: CommissioningParameterPlan; onOpenKnowledgeBase: (code: string) => void }) {
  const relatedProfinetFaults = manufacturerFaultCodes.filter((entry) => ['F08501', 'F08502', 'F01910'].includes(entry.code))
  return <section className="parameter-plan" aria-labelledby="parameter-plan-title">
    <div className="commissioning-heading"><h2 id="parameter-plan-title">G120 Parametre Planı</h2><p>Bu plan yalnızca devreye alma rehberidir; sürücüye parametre yazmaz.</p></div>
    {categoryOrder.map((category) => {
      const entries = plan.recommendations.filter((recommendation) => recommendation.category === category)
      return entries.length > 0 && <section className="parameter-group" key={category}><h3>{category}</h3><div>{entries.map((recommendation) => <ParameterRecommendation key={`${recommendation.code}-${String(recommendation.value)}`} recommendation={recommendation} />)}</div></section>
    })}
    {plan.analogCommandGuide && <section className="analog-command-guide" aria-labelledby="analog-command-guide-title"><h3 id="analog-command-guide-title">Adım Adım Kumanda Kontrolü</h3><p><strong>AI0+</strong> Terminal 3 <b>·</b> <strong>AI0-</strong> Terminal 4</p><ol>{plan.analogCommandGuide.steps.map((item) => <li key={item}>{item}</li>)}</ol><a href={plan.sourceUrl} target="_blank" rel="noopener noreferrer">Resmî Siemens devreye alma kılavuzunu aç</a></section>}
    {plan.profinetWarning && <p className="profinet-warning">{plan.profinetWarning}</p>}
    {plan.profinetGuide && <section className="profinet-guide" aria-labelledby="profinet-guide-title"><h3 id="profinet-guide-title">Adım Adım PROFINET Kontrolü</h3><div className="telegram-flow"><strong>PLC → G120</strong><p><b>PZD1:</b> Control Word 1 (STW1)</p><p><b>PZD2:</b> Speed setpoint</p><strong>G120 → PLC</strong><p><b>PZD1:</b> Status Word 1 (ZSW1)</p><p><b>PZD2:</b> Actual speed / frequency value</p></div><p className="profinet-observation">Telegramdaki hız değerleri normalize edilmiş PROFIdrive değerleri olarak aktarılabilir. PLC programındaki ölçekleme ve referans değerleri proje yapılandırmasına göre doğrulanmalıdır.</p><ol>{plan.profinetGuide.checklist.map((item) => <li key={item}>{item}</li>)}</ol><p className="profinet-safety">PROFINET kumandası Safety Integrated fonksiyonlarının yerine geçmez. STO/PROFIsafe yapılandırması ayrı güvenlik mühendisliği gerektirir.</p><p className="advanced-telegram-note">Standard Telegram 1 temel hız kontrolü içindir. Daha fazla proses verisi gerektiğinde Telegram 20, 350, 352 vb. Siemens telegramları proje gereksinimine göre değerlendirilebilir.</p><div className="profinet-fault-links"><strong>İlgili doğrulanmış hata kodları</strong>{relatedProfinetFaults.map((fault) => <button type="button" key={fault.code} onClick={() => onOpenKnowledgeBase(fault.code)}>{fault.code} — {fault.titleTr}</button>)}</div><a href={plan.sourceUrl} target="_blank" rel="noopener noreferrer">Resmî Siemens PROFINET / PROFIdrive kılavuzunu aç</a></section>}
    <section className="completion-guide" aria-labelledby="completion-guide-title"><h3 id="completion-guide-title">Hızlı Devreye Alma Sonlandırma Sırası</h3><p className="completion-observation">p3900 işlemi motor ve kontrol parametrelerinin dahili olarak yeniden hesaplanmasına neden olabilir.</p><p className="completion-return-note">Dahili hesaplamalar tamamlandıktan sonra p3900 otomatik olarak 0 değerine, p0010 da otomatik olarak 0 değerine döner. Sürücü yalnızca p0010 = 0 olduğunda commissioning modundan çıkmış kabul edilmelidir.</p><div className="completion-options"><strong>p3900 tamamlama seçenekleri</strong><ul><li><b>0</b> Hızlı devreye alma tamamlanmaz</li><li><b>1</b> Hızlı devreye almayı tamamla ve ilgili fabrika ayarı işlemlerini uygula</li><li><b>2</b> Hızlı devreye almayı tamamla</li><li><b>3</b> Yalnız motor verileri / motor-kontrol hesaplamalarıyla tamamla</li></ul><p>Bu kısa açıklamalar Siemens kılavuzunun yerine geçmez. Kesin etki, seçilen CU / firmware ve mevcut makine konfigürasyonuna göre doğrulanmalıdır.</p></div><ol>{plan.completionGuide.sequence.map((item) => <li key={item}>{item}</li>)}</ol><div className="commissioning-flow"><span>Quick Commissioning</span><b>↓</b><span>p3900 ile tamamla</span><b>↓</b><span>p0010 = 0 doğrula</span><b>↓</b><span>Motor Identification</span><b>↓</b><span>p1900</span></div><p className="completion-identification-warning">Motor identification sırasında motor hareket edebilir. p1900 otomatik olarak başlatılmaz.</p><div className="completion-checklist"><strong>Devreye Alma Kontrol Listesi</strong>{plan.completionGuide.checklist.map((item) => <p key={item}>□ {item}</p>)}</div><a href={plan.sourceUrl} target="_blank" rel="noopener noreferrer">Resmî Siemens hızlı devreye alma dokümanını aç</a></section>
    <div className="parameter-plan-warnings">{plan.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div>
  </section>
}

function MotorConnectionCheck({ consistency, confirmed, onConfirm }: { consistency: MotorConnectionConsistency; confirmed: boolean; onConfirm: (checked: boolean) => void }) {
  const statusText = consistency.status === 'consistent' ? 'Etiket bilgileri tutarlı görünüyor.' : consistency.status === 'warning' ? 'Motor terminal bağlantısını ve motor etiketini doğrulayın.' : 'Bağlantı değerlendirmesi için yeterli etiket bilgisi yok.'
  return <section className={`motor-connection-check ${consistency.status}`} aria-labelledby="connection-check-title">
    <h3 id="connection-check-title">Motor Etiketi ve Bağlantı Kontrolü</h3>
    <div className="connection-check-status"><span>{consistency.status === 'consistent' ? '✓' : consistency.status === 'warning' ? '⚠' : 'ℹ'}</span><strong>{statusText}</strong></div>
    {consistency.observations.map((observation) => <p key={observation}>✓ {observation}</p>)}
    {consistency.warnings.map((warning) => <p className="connection-check-warning" key={warning}>⚠ {warning}</p>)}
    {consistency.status === 'warning' && <label className="connection-confirmation"><input type="checkbox" checked={confirmed} onChange={(event) => onConfirm(event.target.checked)} /><span>Motor etiketi ve terminal bağlantısının yetkili personel tarafından doğrulanması gerektiğini anlıyorum.</span></label>}
    <p className="connection-safety-note">Bu kontrol yalnızca etiket verileri üzerinden yapılan bir tutarlılık kontrolüdür. Motor terminal kutusundaki gerçek Y/Δ bağlantısı yetkili personel tarafından enerji güvenli şekilde izole edildikten sonra doğrulanmalıdır.</p>
  </section>
}

function FirstRunCheck({ profile, checks, onCheck, observedCurrent, onObservedCurrent, rotationDirection, setRotationDirection, mechanicalNoise, setMechanicalNoise, vibration, setVibration, unexpectedHeating, setUnexpectedHeating, mechanicalFree, setMechanicalFree, isCurrentHigh, status, onOpenMotorDiagnosis }: {
  profile: CommissioningProfile
  checks: Record<string, boolean>
  onCheck: (item: string, checked: boolean) => void
  observedCurrent: string
  onObservedCurrent: (value: string) => void
  rotationDirection: SafetyAnswer
  setRotationDirection: (value: SafetyAnswer) => void
  mechanicalNoise: SafetyAnswer
  setMechanicalNoise: (value: SafetyAnswer) => void
  vibration: SafetyAnswer
  setVibration: (value: SafetyAnswer) => void
  unexpectedHeating: SafetyAnswer
  setUnexpectedHeating: (value: SafetyAnswer) => void
  mechanicalFree: SafetyAnswer
  setMechanicalFree: (value: SafetyAnswer) => void
  isCurrentHigh: boolean
  status: string
  onOpenMotorDiagnosis: (handoff: FirstRunDiagnosisHandoff) => void
}) {
  const preconditions = ['p0010 = 0 doğrulandı', 'Quick Commissioning tamamlandı', 'Motor etiketi doğrulandı', 'Y/Δ bağlantısı doğrulandı', 'Kumanda kaynağı doğrulandı', 'Minimum / maksimum hız doğrulandı', 'Rampalar doğrulandı', 'Safety / STO koşulları ayrı olarak doğrulandı']
  const monitors = [
    ['r0022', 'Motor gerçek hızı', 'rpm', 'Motorun hesaplanan ve filtrelenmiş gerçek hızını izlemek için.'],
    ['r0024', 'Çıkış frekansı', 'Hz', 'Sürücünün motora uyguladığı çıkış frekansını izlemek için.'],
    ['r0025', 'Çıkış gerilimi', 'V', 'Sürücü güç ünitesinin filtrelenmiş çıkış gerilimini izlemek için.'],
    ['r0026', 'DC bara gerilimi', 'V', 'Sürücünün DC link / DC bara gerilimini izlemek için.'],
    ['r0027', 'Motor çıkış akımı', 'A', 'Motora uygulanan RMS çıkış akımını izlemek için.'],
    ['r0031', 'Motor torku', 'Nm', 'Sürücünün hesapladığı elektriksel motor torkunu izlemek için.'],
    ['r0035', 'Motor sıcaklığı', '°C', 'Sürücüde mevcut motor sıcaklığı bilgisini izlemek için.'],
  ]
  const select = (value: SafetyAnswer, onChange: (value: SafetyAnswer) => void) => <select value={value} onChange={(event) => onChange(event.target.value as SafetyAnswer)}><option value="">Seçiniz</option>{safetyAnswers.map((item) => <option key={item}>{item}</option>)}</select>
  const shouldOfferDiagnosis = mechanicalNoise === 'Evet' || vibration === 'Evet' || unexpectedHeating === 'Evet'
  return <section className="first-run-check" aria-labelledby="first-run-title"><h2 id="first-run-title">İlk Çalıştırma Kontrolü</h2><p className="first-run-safety">İlk çalıştırma sırasında motor ve bağlı mekanizma hareket edebilir. Çalışma alanı güvenli hale getirilmeden test başlatılmamalıdır.</p><p className="first-run-safety secondary">Bu uygulama sürücüyü kontrol etmez ve güvenlik fonksiyonlarının yerine geçmez.</p><div className="first-run-preconditions"><h3>Ön koşullar</h3>{preconditions.map((item) => <label key={item}><input type="checkbox" checked={Boolean(checks[item])} onChange={(event) => onCheck(item, event.target.checked)} /><span>✓ {item}</span></label>)}</div>{preconditions.some((item) => !checks[item]) && <p className="first-run-incomplete">İlk çalıştırma öncesi devreye alma kontrolleri tamamlanmalıdır.</p>}<section className="first-run-section"><h3>Motor Identification</h3><p><b>p1900 = 2</b> — Motor data identification at standstill. Test, bir sonraki geçerli sürücü ON komutuyla başlar.</p><p>Standstill identification sırasında da motora akım uygulanır ve sınırlı mekanik hareket oluşabilir. Başarılı tamamlanmadan sonra p1900 otomatik olarak 0 değerine döner.</p><p><strong>p1900 = 0 değerini işlem sonunda doğrulayın.</strong></p></section><section className="first-run-section"><h3>Döner motor optimizasyonu</h3>{profile.identification.rotationIsSafe === 'Evet' && profile.identification.loadCanBeDisconnected === 'Evet' ? <p>Döner motor optimizasyonu değerlendirilebilir. Döner ölçüm / hız kontrolörü optimizasyonu motoru farklı hızlarda çalıştırabilir; yalnızca makinenin güvenli şekilde dönebildiği durumlarda kullanılmalıdır.</p> : <p>Döner motor optimizasyonu önerilmedi. Motorun güvenli şekilde dönebileceği doğrulanmadı.</p>}</section><section className="first-run-section"><h3>İlk düşük hız testi</h3><ol><li>Motor ve mekanik sistemin güvenli durumda olduğunu doğrulayın.</li><li>İlk test için düşük bir hız referansı kullanın.</li><li>Motor dönüş yönünü gözlemleyin.</li><li>Anormal mekanik ses olup olmadığını kontrol edin.</li><li>Titreşim durumunu kontrol edin.</li><li>Motor akımını gözlemleyin.</li><li>Sürücüde aktif fault/alarm olup olmadığını kontrol edin.</li></ol><p className="first-run-direction-note">Dönüş yönü proses gereksinimiyle uyuşmuyorsa kumanda yönü ve motor bağlantısı enerji güvenli şekilde izole edildikten sonra yetkili personel tarafından değerlendirilmelidir.</p></section><section className="first-run-section"><h3>İlk Çalıştırmada İzlenecek Değerler</h3><div className="first-run-monitors">{monitors.map(([code, name, unit, purpose]) => <article key={code}><code>{code}</code><strong>{name}</strong><span>{unit}</span><p>{purpose}</p>{code === 'r0031' && <small>Elektriksel tork, motor milinde mekanik olarak ölçülen torkla tamamen aynı olmayabilir.</small>}{code === 'r0035' && <small>Motor sıcaklık değeri kullanılan sıcaklık sensörü / termal model yapılandırmasına göre değerlendirilmelidir. -200 °C gibi geçersiz/özel bir değer gerçek motor sıcaklığı olarak yorumlanmamalıdır.</small>}</article>)}</div><p>Normal değerler motor, yük, kontrol modu ve çalışma noktasına bağlıdır.</p></section><section className="first-run-section"><h3>Akım ve mekanik gözlemler</h3>{profile.motor.ratedCurrentA !== undefined && <p>Motor nominal akımı: <strong>{profile.motor.ratedCurrentA} A</strong></p>}<label className="first-run-current">İLK TESTTE GÖZLENEN MOTOR AKIMI<div className="input-suffix"><input type="number" min="0" step="any" value={observedCurrent} onChange={(event) => onObservedCurrent(event.target.value)} placeholder="Örn: 12.5" /><span>A</span></div></label>{observedCurrent !== '' && profile.motor.ratedCurrentA !== undefined && <p className={isCurrentHigh ? 'first-run-warning' : 'first-run-current-ok'}>{isCurrentHigh ? 'İlk test akımı motor nominal akımının üzerinde.' : 'İlk test akımı motor nominal akım sınırı içinde görünüyor.'}</p>}<div className="first-run-answers"><label>MOTOR DÖNÜŞ YÖNÜ DOĞRU MU?{select(rotationDirection, setRotationDirection)}</label><label>ANORMAL SES VAR MI?{select(mechanicalNoise, setMechanicalNoise)}</label><label>BELİRGİN TİTREŞİM VAR MI?{select(vibration, setVibration)}</label><label>MOTOR BEKLENMEDİK ŞEKİLDE ISINIYOR MU?{select(unexpectedHeating, setUnexpectedHeating)}</label><label>MEKANİK SİSTEM SERBEST ÇALIŞIYOR MU?{select(mechanicalFree, setMechanicalFree)}</label></div>{rotationDirection === 'Hayır' && <p className="first-run-warning">Dönüş yönü düzeltilmeden proses çalışmasına devam etmeyin.</p>}{(mechanicalNoise === 'Evet' || vibration === 'Evet' || unexpectedHeating === 'Evet' || mechanicalFree === 'Hayır') && <p className="first-run-warning">İlk test durdurulmalı ve ilgili durum değerlendirilmelidir.</p>}{shouldOfferDiagnosis && <button type="button" className="open-diagnosis-button" onClick={() => onOpenMotorDiagnosis({ ratedCurrentA: profile.motor.ratedCurrentA, observedCurrentA: numericValue(observedCurrent), mechanicalNoise, vibration, unexpectedHeating })}>Yeni Teşhiste İncele</button>}</section><section className="first-run-summary"><h3>İlk Çalıştırma Özeti</h3><span className={status === 'Kontroller tamamlandı' ? 'complete' : status === 'Uyarılar var' ? 'warning' : 'incomplete'}>{status}</span><p><b>Motor:</b> {shownValue(profile.motor.ratedPowerKw)} kW / {shownValue(profile.motor.ratedVoltageV)} V / {shownValue(profile.motor.ratedCurrentA)} A</p><p><b>Sürücü:</b> SINAMICS G120 {profile.drive.controlUnit && `+ ${profile.drive.controlUnit}`}</p><p><b>Kumanda:</b> {shownValue(profile.application.controlMethod)}</p><p><b>Gözlenen akım:</b> {observedCurrent ? `${observedCurrent} A` : '—'}</p><p><b>Dönüş:</b> {shownValue(rotationDirection)}</p><p><b>Mekanik gözlemler:</b> Ses {shownValue(mechanicalNoise)}, titreşim {shownValue(vibration)}, ısınma {shownValue(unexpectedHeating)}, serbest çalışma {shownValue(mechanicalFree)}</p></section><a className="first-run-source" href="https://sid.siemens.com/v/u/A6V10556727" target="_blank" rel="noopener noreferrer">Resmî Siemens motor identification / commissioning dokümanını aç</a></section>
}

export function QuickCommissioning({ onOpenKnowledgeBase, onOpenMotorDiagnosis }: { onOpenKnowledgeBase: (code: string) => void; onOpenMotorDiagnosis: (handoff: FirstRunDiagnosisHandoff) => void }) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<CommissioningProfile>(emptyCommissioningProfile)
  const [validationMessage, setValidationMessage] = useState('')
  const [parameterPlan, setParameterPlan] = useState<CommissioningParameterPlan | null>(null)
  const [confirmedConnectionWarning, setConfirmedConnectionWarning] = useState<string | null>(null)
  const [firstRunChecks, setFirstRunChecks] = useState<Record<string, boolean>>({})
  const [observedCurrent, setObservedCurrent] = useState('')
  const [rotationDirection, setRotationDirection] = useState<SafetyAnswer>('')
  const [mechanicalNoise, setMechanicalNoise] = useState<SafetyAnswer>('')
  const [vibration, setVibration] = useState<SafetyAnswer>('')
  const [unexpectedHeating, setUnexpectedHeating] = useState<SafetyAnswer>('')
  const [mechanicalFree, setMechanicalFree] = useState<SafetyAnswer>('')
  const connectionConsistency = evaluateMotorConnectionConsistency(profile)
  const connectionWarningSignature = JSON.stringify([profile.drive.mainsVoltage, profile.motor.connection, profile.motor.lowVoltageV, profile.motor.highVoltageV, profile.motor.lowVoltageCurrentA, profile.motor.highVoltageCurrentA, profile.motor.lowVoltageConnection, profile.motor.highVoltageConnection, profile.motor.ratedCurrentA])
  const observedCurrentValue = numericValue(observedCurrent)
  const isCurrentHigh = observedCurrentValue !== undefined && profile.motor.ratedCurrentA !== undefined && observedCurrentValue > profile.motor.ratedCurrentA
  const hasAbnormalObservation = mechanicalNoise === 'Evet' || vibration === 'Evet' || unexpectedHeating === 'Evet' || mechanicalFree === 'Hayır' || rotationDirection === 'Hayır' || isCurrentHigh
  const firstRunPreconditions = ['p0010 = 0 doğrulandı', 'Quick Commissioning tamamlandı', 'Motor etiketi doğrulandı', 'Y/Δ bağlantısı doğrulandı', 'Kumanda kaynağı doğrulandı', 'Minimum / maksimum hız doğrulandı', 'Rampalar doğrulandı', 'Safety / STO koşulları ayrı olarak doğrulandı']
  const allFirstRunChecksConfirmed = firstRunPreconditions.every((item) => firstRunChecks[item])
  const firstRunHasUnknowns = [rotationDirection, mechanicalNoise, vibration, unexpectedHeating, mechanicalFree].some((value) => value !== 'Evet' && value !== 'Hayır')
  const firstRunStatus = !allFirstRunChecksConfirmed || firstRunHasUnknowns ? 'Eksik doğrulamalar var' : hasAbnormalObservation ? 'Uyarılar var' : 'Kontroller tamamlandı'

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

  const generatePlan = () => {
    const { motor, motion } = profile
    const requiredMotorValues = [motor.ratedPowerKw, motor.ratedVoltageV, motor.ratedCurrentA, motor.ratedFrequencyHz, motor.ratedSpeedRpm]
    if (requiredMotorValues.some((value) => value === undefined || !Number.isFinite(value) || value <= 0)) {
      setValidationMessage('Parametre planı için motor nominal güç, gerilim, akım, frekans ve hız değerleri 0 değerinden büyük olmalıdır.')
      return
    }
    if (motion.minimumSpeedRpm === undefined || motion.maximumSpeedRpm === undefined || motion.maximumSpeedRpm < motion.minimumSpeedRpm) {
      setValidationMessage('Parametre planı için maksimum motor hızı minimum motor hızına eşit veya daha büyük olmalıdır.')
      return
    }
    if (motion.accelerationTimeSec === undefined || motion.decelerationTimeSec === undefined || motion.accelerationTimeSec <= 0 || motion.decelerationTimeSec <= 0) {
      setValidationMessage('Parametre planı için hızlanma ve yavaşlama süreleri 0 değerinden büyük olmalıdır.')
      return
    }
    if (connectionConsistency.status === 'warning' && confirmedConnectionWarning !== connectionWarningSignature) {
      setValidationMessage('Parametre planı oluşturulmadan önce motor etiketi ve bağlantı kontrolü uyarısını onaylayın.')
      return
    }
    setValidationMessage('')
    setParameterPlan(createCommissioningParameterPlan(profile))
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
      </div><div className="commissioning-subsection"><h3>Çift gerilim etiketi <span>İsteğe bağlı</span></h3><label className="commissioning-label-layout">ETİKET DÜZENİ<select value={profile.motor.lowVoltageConnection === 'Delta' && profile.motor.highVoltageConnection === 'Star' ? 'delta-star' : profile.motor.lowVoltageConnection === 'Star' && profile.motor.highVoltageConnection === 'Delta' ? 'star-delta' : 'manual'} onChange={(event) => setProfile((current) => ({ ...current, motor: { ...current.motor, lowVoltageConnection: event.target.value === 'delta-star' ? 'Delta' : event.target.value === 'star-delta' ? 'Star' : 'Unknown', highVoltageConnection: event.target.value === 'delta-star' ? 'Star' : event.target.value === 'star-delta' ? 'Delta' : 'Unknown' } }))}><option value="delta-star">Δ / Y</option><option value="star-delta">Y / Δ</option><option value="manual">Manuel / Emin değilim</option></select></label><div className="form-grid">
        <NumericField label="DÜŞÜK GERİLİM DEĞERİ" value={profile.motor.lowVoltageV} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, lowVoltageV: numericValue(value) } }))} unit="V" placeholder="Örn: 230" />
        <NumericField label="YÜKSEK GERİLİM DEĞERİ" value={profile.motor.highVoltageV} onChange={(value) => setProfile((current) => ({ ...current, motor: { ...current.motor, highVoltageV: numericValue(value) } }))} unit="V" placeholder="Örn: 400" />
        <label>DÜŞÜK GERİLİM BAĞLANTISI<select value={profile.motor.lowVoltageConnection} onChange={(event) => setProfile((current) => ({ ...current, motor: { ...current.motor, lowVoltageConnection: event.target.value as DualVoltageConnection } }))}>{dualVoltageConnections.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label>YÜKSEK GERİLİM BAĞLANTISI<select value={profile.motor.highVoltageConnection} onChange={(event) => setProfile((current) => ({ ...current, motor: { ...current.motor, highVoltageConnection: event.target.value as DualVoltageConnection } }))}>{dualVoltageConnections.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
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

      {step === 6 && <div><div className="commissioning-heading"><h2>Özet</h2><p>Girilen bilgiler aşağıdadır.</p></div><div className="commissioning-summary">
        <article><h3>Sürücü</h3><SummaryRow label="Üretici" value={profile.drive.manufacturer} /><SummaryRow label="Sürücü ailesi" value={profile.drive.driveFamily} /><SummaryRow label="Control Unit" value={profile.drive.controlUnit} /><SummaryRow label="Şebeke gerilimi" value={profile.drive.mainsVoltage === undefined ? undefined : `${profile.drive.mainsVoltage} V`} /><SummaryRow label="Motor standardı" value={profile.drive.motorStandard} /><SummaryRow label="Motor tipi" value={profile.drive.motorType} /></article>
        <article><h3>Motor etiketi</h3><SummaryRow label="Nominal güç" value={profile.motor.ratedPowerKw === undefined ? undefined : `${profile.motor.ratedPowerKw} kW`} /><SummaryRow label="Nominal gerilim" value={profile.motor.ratedVoltageV === undefined ? undefined : `${profile.motor.ratedVoltageV} V`} /><SummaryRow label="Nominal akım" value={profile.motor.ratedCurrentA === undefined ? undefined : `${profile.motor.ratedCurrentA} A`} /><SummaryRow label="Nominal frekans" value={profile.motor.ratedFrequencyHz === undefined ? undefined : `${profile.motor.ratedFrequencyHz} Hz`} /><SummaryRow label="Nominal hız" value={profile.motor.ratedSpeedRpm === undefined ? undefined : `${profile.motor.ratedSpeedRpm} rpm`} /><SummaryRow label="cos φ" value={profile.motor.powerFactor} /><SummaryRow label="Bağlantı" value={profile.motor.connection} /><SummaryRow label="Düşük / yüksek gerilim" value={profile.motor.lowVoltageV === undefined && profile.motor.highVoltageV === undefined ? undefined : `${shownValue(profile.motor.lowVoltageV)} / ${shownValue(profile.motor.highVoltageV)} V`} /><SummaryRow label="Düşük / yüksek akım" value={profile.motor.lowVoltageCurrentA === undefined && profile.motor.highVoltageCurrentA === undefined ? undefined : `${shownValue(profile.motor.lowVoltageCurrentA)} / ${shownValue(profile.motor.highVoltageCurrentA)} A`} /></article>
        <article><h3>Uygulama</h3><SummaryRow label="Yük tipi" value={profile.application.loadType} /><h3>Kontrol yöntemi</h3><SummaryRow label="Kontrol" value={profile.application.controlMethod} /></article>
        <article><h3>Hız / rampalar</h3><SummaryRow label="Minimum hız" value={profile.motion.minimumSpeedRpm === undefined ? undefined : `${profile.motion.minimumSpeedRpm} rpm`} /><SummaryRow label="Maksimum hız" value={profile.motion.maximumSpeedRpm === undefined ? undefined : `${profile.motion.maximumSpeedRpm} rpm`} /><SummaryRow label="Hızlanma" value={profile.motion.accelerationTimeSec === undefined ? undefined : `${profile.motion.accelerationTimeSec} s`} /><SummaryRow label="Yavaşlama" value={profile.motion.decelerationTimeSec === undefined ? undefined : `${profile.motion.decelerationTimeSec} s`} /></article>
        <article><h3>Motor identification koşulları</h3><SummaryRow label="Yükten ayrılabilir mi?" value={profile.identification.loadCanBeDisconnected} /><SummaryRow label="Dönme güvenli mi?" value={profile.identification.rotationIsSafe} /></article>
      </div><MotorConnectionCheck consistency={connectionConsistency} confirmed={confirmedConnectionWarning === connectionWarningSignature} onConfirm={(checked) => setConfirmedConnectionWarning(checked ? connectionWarningSignature : null)} /><div className="commissioning-plan-notice"><button type="button" onClick={generatePlan}>Parametre Planı Oluştur</button><p>Plan, girilen verilerden oluşturulan rehber niteliğinde öneriler içerir.</p></div>{parameterPlan && <><ParameterPlan plan={parameterPlan} onOpenKnowledgeBase={onOpenKnowledgeBase} /><FirstRunCheck profile={profile} checks={firstRunChecks} onCheck={(item, checked) => setFirstRunChecks((current) => ({ ...current, [item]: checked }))} observedCurrent={observedCurrent} onObservedCurrent={setObservedCurrent} rotationDirection={rotationDirection} setRotationDirection={setRotationDirection} mechanicalNoise={mechanicalNoise} setMechanicalNoise={setMechanicalNoise} vibration={vibration} setVibration={setVibration} unexpectedHeating={unexpectedHeating} setUnexpectedHeating={setUnexpectedHeating} mechanicalFree={mechanicalFree} setMechanicalFree={setMechanicalFree} isCurrentHigh={isCurrentHigh} status={firstRunStatus} onOpenMotorDiagnosis={onOpenMotorDiagnosis} /></>}</div>}

      <div className="commissioning-actions"><button type="button" className="commissioning-back" onClick={previous} disabled={step === 1}>Geri</button>{step < 6 && <button type="button" className="commissioning-next" onClick={next}>Devam <b>→</b></button>}</div>
    </section>
  </section>
}
