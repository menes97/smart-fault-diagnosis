export const MOTOR_EQUIPMENT = 'Üç Fazlı Elektrik Motoru'

export type MotorSymptom =
  | 'Motor ısınıyor'
  | 'Akım nominal değerin üzerinde'
  | 'Mekanik ses var'
  | 'Motor dönmüyor'
  | 'Sigorta açıyor'
  | 'Titreşim artmış'

export interface DiagnosisInput {
  equipment: string
  symptoms: MotorSymptom[]
  nominalCurrent?: number
  measuredCurrent?: number
  phaseMeasurements?: PhaseMeasurements
  motorTemperature?: number
  vibration?: number
}

export interface PhaseMeasurements {
  l1Current?: number
  l2Current?: number
  l3Current?: number
  l1L2Voltage?: number
  l2L3Voltage?: number
  l3L1Voltage?: number
}

export interface FaultDefinition {
  id: string
  title: string
  description: string
  matchingRules: string[]
  recommendedChecks: string[]
  safetyNotes?: string[]
}

export interface DiagnosisResult extends FaultDefinition {
  score: number
  scoringReasons: ScoringReason[]
  observations: Observation[]
  measurements: DiagnosisMeasurements
}

export interface ScoringReason {
  label: string
  points: number
}

export interface Observation {
  label: string
}

export interface DiagnosisMeasurements {
  currentImbalancePercent?: number
  voltageImbalancePercent?: number
}

type ScoringRule = (input: DiagnosisInput) => number

interface FaultRuleSet extends FaultDefinition {
  scoringRules: ScoringRule[]
  scoringRuleLabels: string[]
}

const hasSymptom = (input: DiagnosisInput, symptom: MotorSymptom) =>
  input.symptoms.includes(symptom)

const currentRatio = (input: DiagnosisInput) => {
  if (
    input.nominalCurrent === undefined ||
    input.measuredCurrent === undefined ||
    input.nominalCurrent <= 0
  ) {
    return 0
  }
  return input.measuredCurrent / input.nominalCurrent
}

const measuredAboveNominal = (input: DiagnosisInput) => currentRatio(input) > 1.1
const significantlyAboveNominal = (input: DiagnosisInput) => currentRatio(input) >= 1.25
const hasComparableCurrentMeasurements = (input: DiagnosisInput) =>
  input.nominalCurrent !== undefined &&
  input.nominalCurrent > 0 &&
  input.measuredCurrent !== undefined
const hasSupportedHighCurrentSymptom = (input: DiagnosisInput) =>
  hasSymptom(input, 'Akım nominal değerin üzerinde') &&
  (!hasComparableCurrentMeasurements(input) || input.measuredCurrent! > input.nominalCurrent!)
// Motor class and ambient conditions vary; 80°C is intentionally conservative
// so a routine warm surface, such as 40°C, is not treated as overheating evidence.
const elevatedMotorTemperature = (input: DiagnosisInput) => (input.motorTemperature ?? 0) >= 80
const elevatedVibration = (input: DiagnosisInput) => (input.vibration ?? 0) >= 4.5

// Undefined or null means a field was left empty. Numeric zero is accepted
// because it can be meaningful phase-loss evidence.
const isProvidedMeasurement = (value: number | undefined | null): value is number =>
  value !== undefined && value !== null && Number.isFinite(value)

const completeValues = (values: Array<number | undefined | null>) =>
  values.every(isProvidedMeasurement)

const phaseCurrentValues = (input: DiagnosisInput) => {
  const measurements = input.phaseMeasurements
  const values = [measurements?.l1Current, measurements?.l2Current, measurements?.l3Current]
  return completeValues(values) ? values : null
}

const imbalancePercent = (values: number[] | null) => {
  if (!values) return undefined
  const average = values.reduce((total, value) => total + value, 0) / values.length
  if (average <= 0) return undefined
  const maxDeviation = Math.max(...values.map((value) => Math.abs(value - average)))
  return (maxDeviation / average) * 100
}

const currentImbalancePercent = (input: DiagnosisInput) => imbalancePercent(phaseCurrentValues(input))

const voltageImbalancePercent = (input: DiagnosisInput) => {
  const measurements = input.phaseMeasurements
  const values = [measurements?.l1L2Voltage, measurements?.l2L3Voltage, measurements?.l3L1Voltage]
  return imbalancePercent(completeValues(values) ? values : null)
}

const hasNearPhaseLoss = (input: DiagnosisInput) => {
  const values = phaseCurrentValues(input)
  if (!values) return false
  const ordered = [...values].sort((a, b) => a - b)
  const otherPhaseAverage = (ordered[1] + ordered[2]) / 2
  const meaningfulCurrent = input.nominalCurrent ? input.nominalCurrent * 0.2 : 0.5
  return otherPhaseAverage >= meaningfulCurrent && ordered[0] < otherPhaseAverage * 0.3
}

const currentImbalancePoints = (input: DiagnosisInput) => {
  const percent = currentImbalancePercent(input)
  if (percent === undefined || percent < 5) return 0
  if (percent < 10) return 8
  if (percent < 20) return 16
  if (percent <= 40) return 28
  return 38
}

const hasVoltageImbalance = (input: DiagnosisInput) => (voltageImbalancePercent(input) ?? 0) >= 5
const hasSevereCurrentImbalance = (input: DiagnosisInput) => (currentImbalancePercent(input) ?? 0) > 40
const hasBalancedLineVoltages = (input: DiagnosisInput) => {
  const percent = voltageImbalancePercent(input)
  return percent !== undefined && percent < 3
}

const allSymptoms = (input: DiagnosisInput, selected: MotorSymptom[]) =>
  selected.every((symptom) => hasSymptom(input, symptom))

const motorFaults: FaultRuleSet[] = [
  {
    id: 'mechanical-overload',
    title: 'Mekanik Aşırı Yük',
    description: 'Tahrik edilen yük, motorun çalışma kapasitesinin üzerinde olabilir.',
    matchingRules: ['Motor ısınması', 'Nominal üstü akım veya ölçümde yüksek akım', 'Isınma ve yüksek akımın birlikte görülmesi'],
    recommendedChecks: ['Tahrik edilen ekipmanın serbest hareketini kontrol edin.', 'Yük profilini ve motor anma değerlerini karşılaştırın.', 'Yetkili personel ile kaplin ve aktarma organlarını inceleyin.'],
    safetyNotes: ['Dönen ekipmana müdahale etmeden önce enerji izolasyonunu doğrulayın.'],
    scoringRules: [
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 32 : 0,
      (input) => hasSupportedHighCurrentSymptom(input) ? 8 : 0,
      (input) => measuredAboveNominal(input) ? (significantlyAboveNominal(input) ? 18 : 12) : 0,
      (input) => !hasSymptom(input, 'Motor dönmüyor') ? 16 : 0,
      (input) => hasSymptom(input, 'Mekanik ses var') ? 5 : 0,
      (input) => elevatedMotorTemperature(input) ? 6 : 0,
    ],
    scoringRuleLabels: [
      '"Motor ısınıyor" belirtisi seçildi',
      '"Akım nominal değerin üzerinde" belirtisi seçildi',
      'Ölçülen akım nominal değerin üzerinde',
      'Motorun dönebildiği belirtildi',
      '"Mekanik ses var" belirtisi seçildi',
      'Motor sıcaklığı 80°C veya üzerinde',
    ],
  },
  {
    id: 'bearing-problem',
    title: 'Rulman Problemi',
    description: 'Rulman aşınması, hasarı veya yetersiz yağlama sürtünme ve ısınma oluşturabilir.',
    matchingRules: ['Mekanik ses', 'Artmış titreşim', 'Motor ısınması', 'Üç belirtinin birlikte görülmesi'],
    recommendedChecks: ['Yetkili bakım personeliyle rulman sıcaklığını ve titreşim trendini inceleyin.', 'Yağlama durumunu ekipman üreticisinin talimatlarına göre kontrol edin.', 'Rulman yuvası ve hizalamayı planlı bakım kapsamında değerlendirin.'],
    safetyNotes: ['Ekipman tamamen durmadan ve güvenli şekilde izole edilmeden mekanik inceleme yapmayın.'],
    scoringRules: [
      (input) => hasSymptom(input, 'Mekanik ses var') ? 30 : 0,
      (input) => hasSymptom(input, 'Titreşim artmış') ? 30 : 0,
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 18 : 0,
      (input) => allSymptoms(input, ['Mekanik ses var', 'Titreşim artmış', 'Motor ısınıyor']) ? 22 : 0,
      (input) => elevatedMotorTemperature(input) ? 8 : 0,
      (input) => elevatedVibration(input) ? 15 : 0,
    ],
    scoringRuleLabels: [
      '"Mekanik ses var" belirtisi seçildi',
      '"Titreşim artmış" belirtisi seçildi',
      '"Motor ısınıyor" belirtisi seçildi',
      'Mekanik ses, titreşim ve ısınma birlikte seçildi',
      'Motor sıcaklığı 80°C veya üzerinde',
      'Titreşim değeri 4,5 mm/s veya üzerinde',
    ],
  },
  {
    id: 'phase-loss-imbalance',
    title: 'Faz Kaybı / Faz Dengesizliği',
    description: 'Besleme fazlarından birindeki kayıp veya dengesizlik motorun aşırı akım ve ısınma ile çalışmasına neden olabilir.',
    matchingRules: ['Motor ısınması', 'Nominal üstü akım', 'Motorun dönmemesi veya sigorta açması', 'Ölçülen akımın anma akımını belirgin aşması'],
    recommendedChecks: ['Yetkili elektrik personeliyle faz gerilimleri ve akımlarını karşılaştırın.', 'Klemens, kontaktör ve koruma elemanlarında gevşeklik veya hasar kontrolü planlayın.', 'Besleme dengesizliğini tesis ölçüm prosedürlerine göre doğrulayın.'],
    safetyNotes: ['Gerilim ve akım ölçümleri yalnızca yetkili ve uygun koruyucu ekipman kullanan kişilerce yapılmalıdır.'],
    scoringRules: [
      (input) => currentImbalancePoints(input),
      (input) => hasNearPhaseLoss(input) ? 32 : 0,
      (input) => hasVoltageImbalance(input) ? 25 : 0,
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 4 : 0,
      (input) => hasSupportedHighCurrentSymptom(input) ? 4 : 0,
      (input) => measuredAboveNominal(input) ? 6 : 0,
      (input) => elevatedMotorTemperature(input) ? 4 : 0,
    ],
    scoringRuleLabels: [
      'L1/L2/L3 akımları arasında hesaplanan akım dengesizliği',
      'Bir faz akımı diğer iki faza göre çok düşük',
      'Fazlar arası gerilimlerde dengesizlik tespit edildi',
      '"Motor ısınıyor" belirtisi seçildi',
      '"Akım nominal değerin üzerinde" belirtisi seçildi',
      'Ölçülen akım nominal değerin üzerinde',
      'Motor sıcaklığı 80°C veya üzerinde',
    ],
  },
  {
    id: 'incorrect-connection-parameter',
    title: 'Yanlış Motor Bağlantısı veya Parametresi',
    description: 'Klemens bağlantısı, gerilim seviyesi veya sürücü parametreleri motor etiket değerleriyle uyumsuz olabilir.',
    matchingRules: ['Motorun dönmemesi', 'Sigorta açması', 'Isınma veya nominal üstü akım', 'Ölçülen akımın yüksek olması'],
    recommendedChecks: ['Motor etiket bilgilerini tesis beslemesiyle karşılaştırın.', 'Yıldız/üçgen bağlantısının proje ve etiket bilgisine uygunluğunu yetkili personelle doğrulayın.', 'Varsa sürücü parametrelerini üretici dokümantasyonuna göre gözden geçirin.'],
    safetyNotes: ['Bağlantı değişiklikleri yalnızca yetkili elektrik personeli tarafından yapılmalıdır.'],
    scoringRules: [
      (input) => hasSymptom(input, 'Motor dönmüyor') ? 28 : 0,
      (input) => hasSymptom(input, 'Sigorta açıyor') ? 25 : 0,
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 12 : 0,
      (input) => hasSupportedHighCurrentSymptom(input) ? 8 : 0,
      (input) => measuredAboveNominal(input) ? (significantlyAboveNominal(input) ? 14 : 10) : 0,
      (input) => allSymptoms(input, ['Motor dönmüyor', 'Sigorta açıyor']) ? 10 : 0,
    ],
    scoringRuleLabels: [
      '"Motor dönmüyor" belirtisi seçildi',
      '"Sigorta açıyor" belirtisi seçildi',
      '"Motor ısınıyor" belirtisi seçildi',
      '"Akım nominal değerin üzerinde" belirtisi seçildi',
      'Ölçülen akım nominal değerin üzerinde',
      'Motor dönmüyor ve sigorta açıyor belirtileri birlikte seçildi',
    ],
  },
  {
    id: 'mechanical-jamming',
    title: 'Mekanik Sıkışma',
    description: 'Tahrik edilen mekanizmada sıkışma veya hareketi engelleyen bir durum olabilir.',
    matchingRules: ['Motorun dönmemesi', 'Mekanik ses', 'Yüksek akım', 'Dönmeme ve yüksek akımın birlikte görülmesi'],
    recommendedChecks: ['Enerji kesildikten sonra tahrik edilen mekanizmanın serbestliğini yetkili bakım personeliyle değerlendirin.', 'Kaplin, kayış ve aktarma organlarında fiziksel engel olup olmadığını inceleyin.', 'Sıkışma nedeni giderilmeden tekrar çalıştırmayın.'],
    safetyNotes: ['Sıkışmış ekipmanı elle çevirmeye çalışmadan önce tüm enerji kaynaklarını izole edin.'],
    scoringRules: [
      (input) => hasSymptom(input, 'Motor dönmüyor') ? 42 : 0,
      (input) => hasSymptom(input, 'Mekanik ses var') ? 12 : 0,
      (input) => hasSupportedHighCurrentSymptom(input) ? 8 : 0,
      (input) => significantlyAboveNominal(input) ? 28 : 0,
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 8 : 0,
      (input) => hasSymptom(input, 'Motor dönmüyor') && significantlyAboveNominal(input) ? 10 : 0,
      (input) => elevatedVibration(input) ? 6 : 0,
    ],
    scoringRuleLabels: [
      '"Motor dönmüyor" belirtisi seçildi',
      '"Mekanik ses var" belirtisi seçildi',
      '"Akım nominal değerin üzerinde" belirtisi seçildi',
      'Ölçülen akım nominal değerin önemli ölçüde üzerinde',
      '"Motor ısınıyor" belirtisi seçildi',
      'Motor dönmüyor ve ölçülen akım nominal değerin önemli ölçüde üzerinde',
      'Titreşim değeri 4,5 mm/s veya üzerinde',
    ],
  },
  {
    id: 'electrical-supply-problem',
    title: 'Elektriksel Besleme Problemi',
    description: 'Besleme hattı, koruma elemanları veya bağlantılardaki bir sorun motorun güvenilir şekilde çalışmasını engelliyor olabilir.',
    matchingRules: ['Sigorta açması', 'Motorun dönmemesi', 'Nominal üstü akım veya ölçülen yüksek akım', 'Motor ısınması'],
    recommendedChecks: ['Yetkili elektrik personeliyle koruma elemanlarının durumunu değerlendirin.', 'Besleme hattı ve bağlantı noktalarını tesis bakım prosedürlerine göre kontrol edin.', 'Tekrar devreye almadan önce arıza nedenini doğrulayın.'],
    safetyNotes: ['Koruma elemanını tekrar devreye almadan önce arızanın kaynağı güvenli şekilde tespit edilmelidir.'],
    scoringRules: [
      (input) => hasSymptom(input, 'Sigorta açıyor') ? 34 : 0,
      (input) => hasSymptom(input, 'Motor dönmüyor') ? 25 : 0,
      (input) => hasSupportedHighCurrentSymptom(input) ? 8 : 0,
      (input) => measuredAboveNominal(input) ? (significantlyAboveNominal(input) ? 14 : 10) : 0,
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 8 : 0,
      (input) => allSymptoms(input, ['Sigorta açıyor', 'Motor dönmüyor']) ? 12 : 0,
    ],
    scoringRuleLabels: [
      '"Sigorta açıyor" belirtisi seçildi',
      '"Motor dönmüyor" belirtisi seçildi',
      '"Akım nominal değerin üzerinde" belirtisi seçildi',
      'Ölçülen akım nominal değerin üzerinde',
      '"Motor ısınıyor" belirtisi seçildi',
      'Sigorta açıyor ve motor dönmüyor belirtileri birlikte seçildi',
    ],
  },
]

export function diagnoseMotor(input: DiagnosisInput): DiagnosisResult[] {
  if (input.equipment !== MOTOR_EQUIPMENT) return []

  return motorFaults
    .map(({ scoringRules, scoringRuleLabels, ...fault }) => {
      const scoringReasons = scoringRules
        .map((rule, index) => ({ label: scoringRuleLabels[index], points: rule(input) }))
        .filter((reason) => reason.points > 0)
      const currentPercent = currentImbalancePercent(input)
      const observations: Observation[] = fault.id === 'phase-loss-imbalance'
        ? [
            ...(currentPercent === undefined
              ? []
              : [{ label: `Akım dengesizliği yaklaşık %${currentPercent.toFixed(1)}.` }]),
            ...(hasSevereCurrentImbalance(input) && hasBalancedLineVoltages(input)
              ? [{ label: 'Faz akımlarında ciddi dengesizlik var ancak hat gerilimleri dengeli.' }]
              : []),
          ]
        : []

      return {
        ...fault,
        score: Math.min(100, scoringReasons.reduce((total, reason) => total + reason.points, 0)),
        scoringReasons,
        observations,
        measurements: {
          currentImbalancePercent: currentPercent,
          voltageImbalancePercent: voltageImbalancePercent(input),
        },
      }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'tr'))
}
