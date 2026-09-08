import type { DiagnosisResult, FaultDefinition, Observation, ScoringReason } from './motorDiagnosis'

export const VFD_EQUIPMENT = 'Frekans Konvertörü / VFD'

export type VfdSymptom =
  | 'Drive trip ediyor'
  | 'Motor çalışmıyor'
  | 'Motor düşük hızda çalışıyor'
  | 'Motor aşırı akım çekiyor'
  | 'Drive aşırı ısınıyor'
  | 'Haberleşme hatası var'
  | 'Hız referansı gelmiyor'
  | 'Drive hazır değil'

export interface VfdDiagnosisInput {
  equipment: string
  symptoms: VfdSymptom[]
  faultCode?: string
  dcBusVoltage?: number
  outputCurrent?: number
  motorNominalCurrent?: number
  outputFrequency?: number
  driveTemperature?: number
}

interface VfdRule {
  label: string
  evaluate: (input: VfdDiagnosisInput) => number
}

interface VfdFault extends FaultDefinition {
  scoringRules: VfdRule[]
}

const hasSymptom = (input: VfdDiagnosisInput, symptom: VfdSymptom) =>
  input.symptoms.includes(symptom)

const outputCurrentRatio = (input: VfdDiagnosisInput) => {
  if (
    input.outputCurrent === undefined ||
    input.motorNominalCurrent === undefined ||
    input.motorNominalCurrent <= 0
  ) return undefined

  return input.outputCurrent / input.motorNominalCurrent
}

const outputCurrentAboveNominal = (input: VfdDiagnosisInput) =>
  (outputCurrentRatio(input) ?? 0) > 1.1
const outputCurrentSignificantlyHigh = (input: VfdDiagnosisInput) =>
  (outputCurrentRatio(input) ?? 0) >= 1.25
const hasComparableOutputCurrentMeasurements = (input: VfdDiagnosisInput) =>
  input.outputCurrent !== undefined &&
  input.motorNominalCurrent !== undefined &&
  input.motorNominalCurrent > 0
const hasSupportedOvercurrentSymptom = (input: VfdDiagnosisInput) =>
  hasSymptom(input, 'Motor aşırı akım çekiyor') &&
  (!hasComparableOutputCurrentMeasurements(input) || input.outputCurrent! > input.motorNominalCurrent!)
const highDcBusVoltage = (input: VfdDiagnosisInput) => (input.dcBusVoltage ?? 0) >= 760
const lowDcBusVoltage = (input: VfdDiagnosisInput) =>
  input.dcBusVoltage !== undefined && input.dcBusVoltage <= 400
const highDriveTemperature = (input: VfdDiagnosisInput) => (input.driveTemperature ?? 0) >= 80

const vfdFaults: VfdFault[] = [
  {
    id: 'vfd-overcurrent',
    title: 'Aşırı Akım',
    description: 'Sürücü çıkışında motor veya yük kaynaklı aşırı akım olasılığı görüldü.',
    matchingRules: ['Çıkış akımının motor nominal akımını aşması', 'Aşırı akım veya trip belirtisi'],
    recommendedChecks: ['Motor kablosu ve tahrik edilen yükü yetkili personelle kontrol edin.', 'Motor anma akımı ile sürücü parametrelerini karşılaştırın.', 'Tekrar devreye almadan önce mekanik sıkışma ihtimalini değerlendirin.'],
    safetyNotes: ['Sürücü ve motor bağlantılarına müdahaleden önce enerjiyi güvenli şekilde kesin.'],
    scoringRules: [
      { label: 'Çıkış akımı motor nominal akımının önemli ölçüde üzerinde', evaluate: (input) => outputCurrentSignificantlyHigh(input) ? 45 : 0 },
      { label: 'Çıkış akımı motor nominal akımının üzerinde', evaluate: (input) => outputCurrentAboveNominal(input) && !outputCurrentSignificantlyHigh(input) ? 32 : 0 },
      { label: '"Motor aşırı akım çekiyor" belirtisi seçildi', evaluate: (input) => hasSupportedOvercurrentSymptom(input) ? 12 : 0 },
      { label: '"Drive trip ediyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Drive trip ediyor') ? 8 : 0 },
    ],
  },
  {
    id: 'vfd-overvoltage',
    title: 'DC Bara Aşırı Gerilim',
    description: 'DC bara geriliminde yüksek değer olasılığı görüldü.',
    matchingRules: ['Yüksek DC bara gerilimi', 'Trip belirtisi'],
    recommendedChecks: ['Yetkili elektrik personeliyle besleme gerilimi ve rejeneratif yük koşullarını değerlendirin.', 'Frenleme direnci ve enerji geri besleme koşullarını üretici talimatlarına göre inceleyin.'],
    safetyNotes: ['DC bara kondansatörleri enerji kesildikten sonra da tehlikeli gerilim taşıyabilir.'],
    scoringRules: [
      { label: 'DC bara gerilimi 760 V veya üzerinde', evaluate: (input) => highDcBusVoltage(input) ? 50 : 0 },
      { label: '"Drive trip ediyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Drive trip ediyor') ? 8 : 0 },
    ],
  },
  {
    id: 'vfd-undervoltage',
    title: 'Düşük Besleme veya DC Bara Gerilimi',
    description: 'DC bara gerilimi düşük olabilir; besleme koşulları yetkili personelle doğrulanmalıdır.',
    matchingRules: ['Düşük DC bara gerilimi', 'Hazır değil veya motor çalışmıyor belirtisi'],
    recommendedChecks: ['Kaynak ve sürücü girişindeki besleme gerilimini yetkili elektrik personeliyle karşılaştırın.', 'Şalter, sigorta ve besleme bağlantılarını tesis prosedürlerine göre inceleyin.'],
    safetyNotes: ['Giriş beslemesi kontrolleri yalnızca yetkili elektrik personeli tarafından yapılmalıdır.'],
    scoringRules: [
      { label: 'DC bara gerilimi 400 V veya altında', evaluate: (input) => lowDcBusVoltage(input) ? 50 : 0 },
      { label: '"Drive hazır değil" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Drive hazır değil') ? 8 : 0 },
      { label: '"Motor çalışmıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor çalışmıyor') ? 6 : 0 },
    ],
  },
  {
    id: 'vfd-overtemperature',
    title: 'Sürücü Aşırı Sıcaklığı',
    description: 'Sürücü soğutması veya yük koşulları nedeniyle aşırı sıcaklık olasılığı görüldü.',
    matchingRules: ['Yüksek sürücü sıcaklığı', 'Aşırı ısınma veya trip belirtisi'],
    recommendedChecks: ['Sürücü havalandırma kanalları ve pano soğutmasını inceleyin.', 'Ortam sıcaklığı ile sürücü yükünü üretici sınırlarına göre karşılaştırın.'],
    safetyNotes: ['Soğutma kontrolleri öncesinde enerjiyi güvenli şekilde kesin.'],
    scoringRules: [
      { label: 'Sürücü sıcaklığı 80°C veya üzerinde', evaluate: (input) => highDriveTemperature(input) ? 50 : 0 },
      { label: '"Drive aşırı ısınıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Drive aşırı ısınıyor') ? 15 : 0 },
      { label: '"Drive trip ediyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Drive trip ediyor') ? 6 : 0 },
    ],
  },
  {
    id: 'vfd-motor-overload',
    title: 'Motor Aşırı Yükü',
    description: 'Motor yükü veya akım sınırı motorun anma değerinin üzerinde olabilir.',
    matchingRules: ['Çıkış akımının motor nominal akımını aşması', 'Motor aşırı akım veya düşük hız belirtisi'],
    recommendedChecks: ['Tahrik edilen yükü ve motor anma değerlerini karşılaştırın.', 'Mekanik hareket serbestliğini enerji izolasyonu altında değerlendirin.', 'Akım limiti ve motor parametrelerini üretici dokümantasyonuna göre gözden geçirin.'],
    safetyNotes: ['Mekanik kontrollerden önce motor ve sürücüyü güvenli şekilde izole edin.'],
    scoringRules: [
      { label: 'Çıkış akımı motor nominal akımının önemli ölçüde üzerinde', evaluate: (input) => outputCurrentSignificantlyHigh(input) ? 42 : 0 },
      { label: 'Çıkış akımı motor nominal akımının üzerinde', evaluate: (input) => outputCurrentAboveNominal(input) && !outputCurrentSignificantlyHigh(input) ? 28 : 0 },
      { label: '"Motor aşırı akım çekiyor" belirtisi seçildi', evaluate: (input) => hasSupportedOvercurrentSymptom(input) ? 10 : 0 },
      { label: '"Motor düşük hızda çalışıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor düşük hızda çalışıyor') ? 6 : 0 },
    ],
  },
  {
    id: 'vfd-communication',
    title: 'Haberleşme Problemi',
    description: 'Sürücü kontrol haberleşmesinde problem olasılığı görüldü.',
    matchingRules: ['Haberleşme hatası belirtisi', 'Drive hazır değil belirtisi'],
    recommendedChecks: ['Yetkili personelle haberleşme kablosu, ekranlama ve terminasyonları kontrol edin.', 'Kontrolör ile sürücü adresleme ve iletişim parametrelerini karşılaştırın.'],
    safetyNotes: ['Kontrol devresi bağlantılarını değiştirmeden önce tesis prosedürlerini uygulayın.'],
    scoringRules: [
      { label: '"Haberleşme hatası var" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Haberleşme hatası var') ? 45 : 0 },
      { label: '"Drive hazır değil" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Drive hazır değil') ? 8 : 0 },
    ],
  },
  {
    id: 'vfd-speed-reference',
    title: 'Hız Referansı Problemi',
    description: 'Sürücüye hız referansı veya çalışma komutu gelmiyor olabilir.',
    matchingRules: ['Hız referansı gelmiyor belirtisi', 'Motorun çalışmaması veya düşük hızda çalışması'],
    recommendedChecks: ['Yetkili personelle analog, dijital veya haberleşme referans kaynağını doğrulayın.', 'Çalıştırma izni, set değeri ve kontrol modu parametrelerini inceleyin.'],
    safetyNotes: ['Kontrol parametreleri değiştirileceğinde tesis yetkilendirme prosedürlerini uygulayın.'],
    scoringRules: [
      { label: '"Hız referansı gelmiyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Hız referansı gelmiyor') ? 45 : 0 },
      { label: '"Motor çalışmıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor çalışmıyor') ? 8 : 0 },
      { label: '"Motor düşük hızda çalışıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor düşük hızda çalışıyor') ? 8 : 0 },
    ],
  },
  {
    id: 'vfd-not-ready',
    title: 'Sürücü Hazır Değil',
    description: 'Sürücü hazır duruma geçemiyor olabilir; aktif kilit veya izin koşulları kontrol edilmelidir.',
    matchingRules: ['Drive hazır değil belirtisi', 'Trip veya motor çalışmıyor belirtisi'],
    recommendedChecks: ['Aktif sürücü durumunu ve izin zincirini yetkili personelle kontrol edin.', 'Emniyet, interlock ve çalışma komutu koşullarını inceleyin.'],
    safetyNotes: ['Emniyet devrelerini devre dışı bırakmadan önce tesis prosedürlerini uygulayın.'],
    scoringRules: [
      { label: '"Drive hazır değil" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Drive hazır değil') ? 48 : 0 },
      { label: '"Drive trip ediyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Drive trip ediyor') ? 12 : 0 },
      { label: '"Motor çalışmıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor çalışmıyor') ? 8 : 0 },
    ],
  },
]

const getObservations = (input: VfdDiagnosisInput): Observation[] => [
  ...(input.faultCode ? [{ label: `Girilen hata kodu: ${input.faultCode}. Bu sürümde üreticiye özgü anlamı yorumlanmaz.` }] : []),
  ...(input.dcBusVoltage === undefined ? [] : [{ label: `DC bara gerilimi: ${input.dcBusVoltage} V.` }]),
  ...(input.outputFrequency === undefined ? [] : [{ label: `Çıkış frekansı: ${input.outputFrequency} Hz.` }]),
]

export function diagnoseVfd(input: VfdDiagnosisInput): DiagnosisResult[] {
  if (input.equipment !== VFD_EQUIPMENT) return []

  const observations = getObservations(input)
  return vfdFaults
    .map(({ scoringRules, ...fault }) => {
      const scoringReasons: ScoringReason[] = scoringRules
        .map((rule) => ({ label: rule.label, points: rule.evaluate(input) }))
        .filter((reason) => reason.points > 0)

      return {
        ...fault,
        score: Math.min(100, scoringReasons.reduce((total, reason) => total + reason.points, 0)),
        scoringReasons,
        observations,
        measurements: {},
      }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'tr'))
}
