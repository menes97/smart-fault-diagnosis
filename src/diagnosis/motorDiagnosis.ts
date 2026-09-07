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
}

type ScoringRule = (input: DiagnosisInput) => number

interface FaultRuleSet extends FaultDefinition {
  scoringRules: ScoringRule[]
}

const hasSymptom = (input: DiagnosisInput, symptom: MotorSymptom) =>
  input.symptoms.includes(symptom)

const currentRatio = (input: DiagnosisInput) => {
  if (!input.nominalCurrent || !input.measuredCurrent || input.nominalCurrent <= 0) {
    return 0
  }
  return input.measuredCurrent / input.nominalCurrent
}

const aboveNominal = (input: DiagnosisInput) =>
  hasSymptom(input, 'Akım nominal değerin üzerinde') || currentRatio(input) > 1.1

const significantlyAboveNominal = (input: DiagnosisInput) => currentRatio(input) >= 1.25

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
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 25 : 0,
      (input) => aboveNominal(input) ? 25 : 0,
      (input) => significantlyAboveNominal(input) ? 15 : 0,
      (input) => allSymptoms(input, ['Motor ısınıyor', 'Akım nominal değerin üzerinde']) ? 25 : 0,
      (input) => hasSymptom(input, 'Mekanik ses var') ? 5 : 0,
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
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 16 : 0,
      (input) => aboveNominal(input) ? 20 : 0,
      (input) => significantlyAboveNominal(input) ? 18 : 0,
      (input) => hasSymptom(input, 'Motor dönmüyor') ? 18 : 0,
      (input) => hasSymptom(input, 'Sigorta açıyor') ? 18 : 0,
      (input) => allSymptoms(input, ['Motor ısınıyor', 'Akım nominal değerin üzerinde']) ? 10 : 0,
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
      (input) => aboveNominal(input) ? 15 : 0,
      (input) => significantlyAboveNominal(input) ? 10 : 0,
      (input) => allSymptoms(input, ['Motor dönmüyor', 'Sigorta açıyor']) ? 10 : 0,
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
      (input) => hasSymptom(input, 'Motor dönmüyor') ? 38 : 0,
      (input) => hasSymptom(input, 'Mekanik ses var') ? 18 : 0,
      (input) => aboveNominal(input) ? 18 : 0,
      (input) => significantlyAboveNominal(input) ? 10 : 0,
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 8 : 0,
      (input) => allSymptoms(input, ['Motor dönmüyor', 'Akım nominal değerin üzerinde']) ? 15 : 0,
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
      (input) => aboveNominal(input) ? 15 : 0,
      (input) => significantlyAboveNominal(input) ? 10 : 0,
      (input) => hasSymptom(input, 'Motor ısınıyor') ? 8 : 0,
      (input) => allSymptoms(input, ['Sigorta açıyor', 'Motor dönmüyor']) ? 12 : 0,
    ],
  },
]

export function diagnoseMotor(input: DiagnosisInput): DiagnosisResult[] {
  if (input.equipment !== MOTOR_EQUIPMENT) return []

  return motorFaults
    .map(({ scoringRules, ...fault }) => ({
      ...fault,
      score: Math.min(100, scoringRules.reduce((total, rule) => total + rule(input), 0)),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'tr'))
}
