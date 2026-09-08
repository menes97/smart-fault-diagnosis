export const MOTOR_EQUIPMENT = 'Üç Fazlı Elektrik Motoru'

export type MotorSymptom =
  | 'Motor ısınıyor'
  | 'Akım nominal değerin üzerinde'
  | 'Mekanik ses var'
  | 'Motor dönmüyor'
  | 'Sigorta açıyor'
  | 'Titreşim artmış'

export interface PhaseMeasurements {
  l1Current?: number
  l2Current?: number
  l3Current?: number
  l1L2Voltage?: number
  l2L3Voltage?: number
  l3L1Voltage?: number
}

export interface DiagnosisInput {
  equipment: string
  symptoms: MotorSymptom[]
  nominalCurrent?: number
  measuredCurrent?: number
  phaseMeasurements?: PhaseMeasurements
  motorTemperature?: number
  vibration?: number
}

export interface FaultDefinition {
  id: string
  title: string
  description: string
  matchingRules: string[]
  recommendedChecks: string[]
  safetyNotes?: string[]
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

export interface DiagnosisResult extends FaultDefinition {
  score: number
  scoringReasons: ScoringReason[]
  observations: Observation[]
  measurements: DiagnosisMeasurements
}

interface ScoringRule {
  label: string
  evaluate: (input: DiagnosisInput) => number
}

interface FaultRuleSet extends FaultDefinition {
  scoringRules: ScoringRule[]
}

const hasSymptom = (input: DiagnosisInput, symptom: MotorSymptom) =>
  input.symptoms.includes(symptom)

const isProvidedMeasurement = (value: number | undefined | null): value is number =>
  value !== undefined && value !== null && Number.isFinite(value)

const completeValues = (values: Array<number | undefined | null>) =>
  values.every(isProvidedMeasurement)

const currentRatio = (input: DiagnosisInput) => {
  if (
    input.nominalCurrent === undefined ||
    input.measuredCurrent === undefined ||
    input.nominalCurrent <= 0
  ) return undefined

  return input.measuredCurrent / input.nominalCurrent
}

const measuredAboveNominal = (input: DiagnosisInput) => (currentRatio(input) ?? 0) > 1.1
const significantlyAboveNominal = (input: DiagnosisInput) => (currentRatio(input) ?? 0) >= 1.25
const hasComparableCurrentMeasurements = (input: DiagnosisInput) =>
  input.nominalCurrent !== undefined && input.nominalCurrent > 0 && input.measuredCurrent !== undefined
const hasSupportedHighCurrentSymptom = (input: DiagnosisInput) =>
  hasSymptom(input, 'Akım nominal değerin üzerinde') &&
  (!hasComparableCurrentMeasurements(input) || input.measuredCurrent! > input.nominalCurrent!)

const elevatedMotorTemperature = (input: DiagnosisInput) => (input.motorTemperature ?? 0) >= 80
const elevatedVibration = (input: DiagnosisInput) => (input.vibration ?? 0) >= 4.5

const phaseCurrentValues = (input: DiagnosisInput) => {
  const phase = input.phaseMeasurements
  const values = [phase?.l1Current, phase?.l2Current, phase?.l3Current]
  return completeValues(values) ? values : null
}

const lineVoltageValues = (input: DiagnosisInput) => {
  const phase = input.phaseMeasurements
  const values = [phase?.l1L2Voltage, phase?.l2L3Voltage, phase?.l3L1Voltage]
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
const voltageImbalancePercent = (input: DiagnosisInput) => imbalancePercent(lineVoltageValues(input))

const hasNearPhaseLoss = (input: DiagnosisInput) => {
  const values = phaseCurrentValues(input)
  if (!values) return false
  const ordered = [...values].sort((a, b) => a - b)
  const otherPhaseAverage = (ordered[1] + ordered[2]) / 2
  const meaningfulCurrent = input.nominalCurrent ? input.nominalCurrent * 0.2 : 0.5
  return otherPhaseAverage >= meaningfulCurrent && ordered[0] < otherPhaseAverage * 0.3
}

const hasVeryAbnormalLineVoltage = (input: DiagnosisInput) => {
  const values = lineVoltageValues(input)
  if (!values) return false
  const ordered = [...values].sort((a, b) => a - b)
  const otherVoltageAverage = (ordered[1] + ordered[2]) / 2
  return otherVoltageAverage >= 100 && ordered[0] < otherVoltageAverage * 0.3
}

const currentImbalancePoints = (input: DiagnosisInput) => {
  const percent = currentImbalancePercent(input)
  if (percent === undefined || percent < 5) return 0
  if (percent < 10) return 8
  if (percent < 20) return 16
  if (percent <= 40) return 28
  return 38
}

const voltageImbalancePoints = (input: DiagnosisInput) => {
  const percent = voltageImbalancePercent(input)
  if (percent === undefined || percent < 5) return 0
  if (percent < 10) return 15
  if (percent < 20) return 25
  return 40
}

const hasSubstantialCurrentImbalance = (input: DiagnosisInput) =>
  (currentImbalancePercent(input) ?? 0) >= 20
const hasSevereCurrentImbalance = (input: DiagnosisInput) =>
  (currentImbalancePercent(input) ?? 0) > 40
const hasBalancedLineVoltages = (input: DiagnosisInput) => {
  const percent = voltageImbalancePercent(input)
  return percent !== undefined && percent < 3
}
const allSymptoms = (input: DiagnosisInput, symptoms: MotorSymptom[]) =>
  symptoms.every((symptom) => hasSymptom(input, symptom))

const motorFaults: FaultRuleSet[] = [
  {
    id: 'mechanical-overload',
    title: 'Mekanik Aşırı Yük',
    description: 'Tahrik edilen yük, motorun çalışma kapasitesinin üzerinde olabilir.',
    matchingRules: ['Motor ısınması', 'Nominal üstü akım belirtisi veya ölçümü', 'Mekanik ses'],
    recommendedChecks: ['Tahrik edilen ekipmanın serbest hareketini kontrol edin.', 'Yük profilini ve motor anma değerlerini karşılaştırın.', 'Yetkili personel ile kaplin ve aktarma organlarını inceleyin.'],
    safetyNotes: ['Dönen ekipmana müdahale etmeden önce enerji izolasyonunu doğrulayın.'],
    scoringRules: [
      { label: '"Motor ısınıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor ısınıyor') ? 32 : 0 },
      { label: '"Akım nominal değerin üzerinde" belirtisi seçildi', evaluate: (input) => hasSupportedHighCurrentSymptom(input) ? 8 : 0 },
      { label: 'Ölçülen akım nominal değerin üzerinde', evaluate: (input) => measuredAboveNominal(input) ? (significantlyAboveNominal(input) ? 18 : 12) : 0 },
      { label: '"Mekanik ses var" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Mekanik ses var') ? 5 : 0 },
      { label: 'Motor sıcaklığı 80°C veya üzerinde', evaluate: (input) => elevatedMotorTemperature(input) ? 6 : 0 },
    ],
  },
  {
    id: 'mechanical-jamming',
    title: 'Mekanik Sıkışma',
    description: 'Tahrik edilen mekanizmada sıkışma veya hareketi engelleyen bir durum olabilir.',
    matchingRules: ['Motorun dönmemesi', 'Mekanik ses', 'Belirgin yüksek akım'],
    recommendedChecks: ['Enerji kesildikten sonra tahrik edilen mekanizmanın serbestliğini yetkili bakım personeliyle değerlendirin.', 'Kaplin, kayış ve aktarma organlarında fiziksel engel olup olmadığını inceleyin.', 'Sıkışma nedeni giderilmeden tekrar çalıştırmayın.'],
    safetyNotes: ['Sıkışmış ekipmanı elle çevirmeye çalışmadan önce tüm enerji kaynaklarını izole edin.'],
    scoringRules: [
      { label: '"Motor dönmüyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor dönmüyor') ? 42 : 0 },
      { label: '"Mekanik ses var" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Mekanik ses var') ? 12 : 0 },
      { label: '"Akım nominal değerin üzerinde" belirtisi seçildi', evaluate: (input) => hasSupportedHighCurrentSymptom(input) ? 8 : 0 },
      { label: 'Ölçülen akım nominal değerin önemli ölçüde üzerinde', evaluate: (input) => significantlyAboveNominal(input) ? 28 : 0 },
      { label: '"Motor ısınıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor ısınıyor') ? 8 : 0 },
      { label: 'Motor dönmüyor ve ölçülen akım nominal değerin önemli ölçüde üzerinde', evaluate: (input) => hasSymptom(input, 'Motor dönmüyor') && significantlyAboveNominal(input) ? 10 : 0 },
      { label: 'Titreşim değeri 4,5 mm/s veya üzerinde', evaluate: (input) => elevatedVibration(input) ? 6 : 0 },
    ],
  },
  {
    id: 'bearing-problem',
    title: 'Rulman Problemi',
    description: 'Rulman aşınması, hasarı veya yetersiz yağlama sürtünme ve ısınma oluşturabilir.',
    matchingRules: ['Mekanik ses', 'Artmış titreşim', 'Motor ısınması'],
    recommendedChecks: ['Yetkili bakım personeliyle rulman sıcaklığını ve titreşim trendini inceleyin.', 'Yağlama durumunu ekipman üreticisinin talimatlarına göre kontrol edin.', 'Rulman yuvası ve hizalamayı planlı bakım kapsamında değerlendirin.'],
    safetyNotes: ['Ekipman tamamen durmadan ve güvenli şekilde izole edilmeden mekanik inceleme yapmayın.'],
    scoringRules: [
      { label: '"Mekanik ses var" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Mekanik ses var') ? 30 : 0 },
      { label: '"Titreşim artmış" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Titreşim artmış') ? 30 : 0 },
      { label: '"Motor ısınıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor ısınıyor') ? 18 : 0 },
      { label: 'Mekanik ses, titreşim ve ısınma birlikte seçildi', evaluate: (input) => allSymptoms(input, ['Mekanik ses var', 'Titreşim artmış', 'Motor ısınıyor']) ? 22 : 0 },
      { label: 'Motor sıcaklığı 80°C veya üzerinde', evaluate: (input) => elevatedMotorTemperature(input) ? 8 : 0 },
      { label: 'Titreşim değeri 4,5 mm/s veya üzerinde', evaluate: (input) => elevatedVibration(input) ? 15 : 0 },
    ],
  },
  {
    id: 'phase-loss',
    title: 'Faz Kaybı',
    description: 'Bir fazın kaybı veya çok anormal besleme durumu olasıdır; yetkili elektrik personeliyle doğrulanmalıdır.',
    matchingRules: ['Bir faz akımının diğer iki faza göre çok düşük olması', 'Bir hat geriliminin çok düşük veya kayıp olması'],
    recommendedChecks: ['Yetkili elektrik personeliyle faz gerilimleri ve akımlarını karşılaştırın.', 'Klemens, kontaktör ve koruma elemanlarında gevşeklik veya hasar kontrolü planlayın.', 'Besleme dengesizliğini tesis ölçüm prosedürlerine göre doğrulayın.'],
    safetyNotes: ['Gerilim ve akım ölçümleri yalnızca yetkili ve uygun koruyucu ekipman kullanan kişilerce yapılmalıdır.'],
    scoringRules: [
      { label: 'Bir faz akımı diğer iki faza göre çok düşük', evaluate: (input) => hasNearPhaseLoss(input) ? 42 : 0 },
      { label: 'Bir hat gerilimi diğer hat gerilimlerine göre çok düşük', evaluate: (input) => hasVeryAbnormalLineVoltage(input) ? 45 : 0 },
      { label: 'Fazlar arası gerilimlerde dengesizlik tespit edildi', evaluate: (input) => voltageImbalancePoints(input) >= 25 ? 12 : 0 },
      { label: '"Motor ısınıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor ısınıyor') ? 3 : 0 },
      { label: 'Ölçülen akım nominal değerin üzerinde', evaluate: (input) => measuredAboveNominal(input) ? 4 : 0 },
    ],
  },
  {
    id: 'phase-current-imbalance',
    title: 'Faz Akımı Dengesizliği',
    description: 'Faz akımları arasında ölçüme dayalı dengesizlik tespit edildi.',
    matchingRules: ['Üç faz akımının birlikte ölçülmesi', 'Sayısal akım dengesizliği', 'Düşük faz akımında dengeli hat gerilimleri'],
    recommendedChecks: ['Faz akımlarını aynı çalışma koşulunda yeniden doğrulayın.', 'Yetkili elektrik personeliyle bağlantı noktaları ve yük dağılımını inceleyin.', 'Ölçümleri tesis prosedürlerine göre kaydedip karşılaştırın.'],
    safetyNotes: ['Canlı ekipmanda ölçüm yalnızca yetkili personel tarafından yapılmalıdır.'],
    scoringRules: [
      { label: 'L1/L2/L3 akımları arasında hesaplanan akım dengesizliği', evaluate: (input) => currentImbalancePoints(input) },
      { label: 'Bir faz akımı çok düşük ve hat gerilimleri dengeli', evaluate: (input) => hasNearPhaseLoss(input) && hasBalancedLineVoltages(input) ? 16 : 0 },
      { label: 'Faz akımlarında ciddi dengesizlik var ancak hat gerilimleri dengeli', evaluate: (input) => hasSevereCurrentImbalance(input) && hasBalancedLineVoltages(input) ? 8 : 0 },
      { label: '"Motor ısınıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor ısınıyor') ? 3 : 0 },
    ],
  },
  {
    id: 'winding-problem',
    title: 'Motor Sargı Problemi',
    description: 'Olası sargı problemi: iç devre dengesizliği veya izolasyon etkisi, yetkili testlerle doğrulanmalıdır.',
    matchingRules: ['Belirgin faz akımı dengesizliği', 'Dengeli hat gerilimleri', 'Isınma bulgusu'],
    recommendedChecks: ['Yetkili personel ile sargı dirençlerini karşılaştırın.', 'Üretici talimatlarına uygun izolasyon testlerini planlayın.', 'Bağlantılar doğrulandıktan sonra motoru yeniden değerlendirin.'],
    safetyNotes: ['Yalıtım ve direnç testleri ekipman üreticisinin prosedürlerine göre yetkili kişilerce yapılmalıdır.'],
    scoringRules: [
      { label: 'Faz akımlarında belirgin dengesizlik tespit edildi', evaluate: (input) => hasSubstantialCurrentImbalance(input) ? 28 : 0 },
      { label: 'Hat gerilimleri dengeli', evaluate: (input) => hasBalancedLineVoltages(input) ? 18 : 0 },
      { label: '"Motor ısınıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor ısınıyor') ? 12 : 0 },
      { label: 'Motor sıcaklığı 80°C veya üzerinde', evaluate: (input) => elevatedMotorTemperature(input) ? 8 : 0 },
    ],
  },
  {
    id: 'contactor-connection-problem',
    title: 'Kontaktör / Elektriksel Bağlantı Problemi',
    description: 'Olası kontaktör veya elektriksel bağlantı problemi, ölçümlerle yerinde doğrulanmalıdır.',
    matchingRules: ['Asimetrik veya düşük faz akımı', 'Dengeli üst besleme gerilimleri', 'Elektriksel belirti'],
    recommendedChecks: ['Yetkili elektrik personeliyle kontaktör, klemens ve kablo bağlantılarını inceleyin.', 'Bağlantı noktalarında ısınma, gevşeklik veya oksitlenme olup olmadığını kontrol edin.', 'Koruma elemanlarını tesis prosedürlerine göre değerlendirin.'],
    safetyNotes: ['Bağlantı kontrolleri enerji izolasyonu sağlandıktan sonra yetkili personelce yapılmalıdır.'],
    scoringRules: [
      { label: 'Bir faz akımı çok düşük ve hat gerilimleri dengeli', evaluate: (input) => hasNearPhaseLoss(input) && hasBalancedLineVoltages(input) ? 30 : 0 },
      { label: 'Belirgin akım dengesizliği ve dengeli hat gerilimleri', evaluate: (input) => hasSubstantialCurrentImbalance(input) && hasBalancedLineVoltages(input) ? 18 : 0 },
      { label: '"Sigorta açıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Sigorta açıyor') ? 7 : 0 },
      { label: '"Motor dönmüyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor dönmüyor') ? 7 : 0 },
    ],
  },
  {
    id: 'supply-voltage-problem',
    title: 'Besleme Gerilim Problemi',
    description: 'Hat gerilimi ölçümlerinde besleme kaynaklı anormallik olasılığı görüldü.',
    matchingRules: ['Çok düşük veya kayıp hat gerilimi', 'Sayısal hat gerilimi dengesizliği'],
    recommendedChecks: ['Yetkili elektrik personeliyle kaynak ve motor tarafındaki hat gerilimlerini karşılaştırın.', 'Koruma, şalter ve kablo güzergâhlarını tesis prosedürlerine göre inceleyin.', 'Besleme kararlılığı doğrulanmadan ekipmanı yeniden devreye almayın.'],
    safetyNotes: ['Gerilim ölçümleri uygun koruyucu ekipmanla yetkili elektrik personeli tarafından yapılmalıdır.'],
    scoringRules: [
      { label: 'Bir hat gerilimi diğer hat gerilimlerine göre çok düşük', evaluate: (input) => hasVeryAbnormalLineVoltage(input) ? 50 : 0 },
      { label: 'Fazlar arası gerilimlerde hesaplanan dengesizlik', evaluate: (input) => voltageImbalancePoints(input) },
      { label: '"Sigorta açıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Sigorta açıyor') ? 4 : 0 },
      { label: '"Motor dönmüyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor dönmüyor') ? 4 : 0 },
    ],
  },
  {
    id: 'star-delta-connection',
    title: 'Yanlış Yıldız / Üçgen Bağlantısı',
    description: 'Olası yıldız/üçgen bağlantı uyumsuzluğu, motor etiketi ve tesis gerilimi ile doğrulanmalıdır.',
    matchingRules: ['Isınma', 'Nominal üstü akım', 'Motor etiket ve bağlantı doğrulaması gereksinimi'],
    recommendedChecks: ['Motor etiket bilgilerini tesis beslemesiyle karşılaştırın.', 'Yıldız/üçgen bağlantısının proje ve etiket bilgisine uygunluğunu yetkili personelle doğrulayın.', 'Varsa sürücü parametrelerini üretici dokümantasyonuna göre gözden geçirin.'],
    safetyNotes: ['Bağlantı değişiklikleri yalnızca yetkili elektrik personeli tarafından yapılmalıdır.'],
    scoringRules: [
      { label: '"Motor ısınıyor" belirtisi seçildi', evaluate: (input) => hasSymptom(input, 'Motor ısınıyor') ? 10 : 0 },
      { label: '"Akım nominal değerin üzerinde" belirtisi seçildi', evaluate: (input) => hasSupportedHighCurrentSymptom(input) ? 8 : 0 },
      { label: 'Ölçülen akım nominal değerin üzerinde', evaluate: (input) => measuredAboveNominal(input) ? 12 : 0 },
      { label: 'Hat gerilimleri dengeli', evaluate: (input) => hasBalancedLineVoltages(input) ? 6 : 0 },
    ],
  },
]

const phaseObservationFaultIds = new Set([
  'phase-loss',
  'phase-current-imbalance',
  'winding-problem',
  'contactor-connection-problem',
  'supply-voltage-problem',
])

const getObservations = (faultId: string, input: DiagnosisInput): Observation[] => {
  if (!phaseObservationFaultIds.has(faultId)) return []

  const currentPercent = currentImbalancePercent(input)
  const voltagePercent = voltageImbalancePercent(input)

  return [
    ...(currentPercent === undefined ? [] : [{ label: `Akım dengesizliği yaklaşık %${currentPercent.toFixed(1)}.` }]),
    ...(voltagePercent === undefined ? [] : [{ label: `Hat gerilimi dengesizliği yaklaşık %${voltagePercent.toFixed(1)}.` }]),
    ...(hasSevereCurrentImbalance(input) && hasBalancedLineVoltages(input)
      ? [{ label: 'Faz akımlarında ciddi dengesizlik var ancak hat gerilimleri dengeli.' }]
      : []),
  ]
}

export function diagnoseMotor(input: DiagnosisInput): DiagnosisResult[] {
  if (input.equipment !== MOTOR_EQUIPMENT) return []

  const measurements: DiagnosisMeasurements = {
    currentImbalancePercent: currentImbalancePercent(input),
    voltageImbalancePercent: voltageImbalancePercent(input),
  }

  return motorFaults
    .map(({ scoringRules, ...fault }) => {
      const scoringReasons = scoringRules
        .map((rule) => ({ label: rule.label, points: rule.evaluate(input) }))
        .filter((reason) => reason.points > 0)

      return {
        ...fault,
        score: Math.min(100, scoringReasons.reduce((total, reason) => total + reason.points, 0)),
        scoringReasons,
        observations: getObservations(fault.id, input),
        measurements,
      }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'tr'))
}

