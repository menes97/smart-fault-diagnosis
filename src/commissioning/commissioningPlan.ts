import type { CommissioningProfile } from './commissioningTypes'
import { evaluateMotorConnectionConsistency } from './motorConnectionConsistency'

export type CommissioningParameterConfidence = 'verified-direct' | 'conditional' | 'informational'
export type CommissioningParameterCategory = 'Devreye Alma' | 'Motor Etiketi' | 'Hız / Rampalar' | 'Kumanda / Kontrol' | 'Kumanda ve Analog Hız Referansı' | 'PROFINET / PLC Kumandası' | 'Devreye Almayı Tamamlama' | 'Motor Identification'

export interface CommissioningParameterRecommendation {
  code: string
  nameTr: string
  value: string | number
  unit?: string
  source: string
  confidence: CommissioningParameterConfidence
  category: CommissioningParameterCategory
  explanationTr: string
  warningTr?: string
  requiresUserConfirmation: boolean
}

export interface CommissioningParameterPlan {
  recommendations: CommissioningParameterRecommendation[]
  warnings: string[]
  sourceName: string
  sourceUrl: string
  analogCommandGuide?: AnalogCommandGuide
  profinetGuide?: ProfinetGuide
  profinetWarning?: string
  completionGuide: CompletionGuide
}

export interface AnalogCommandGuide {
  mode: '0–10 V' | '4–20 mA'
  hardwareSwitch: 'U (Voltage)' | 'I (Current)'
  steps: string[]
}

export interface ProfinetGuide {
  checklist: string[]
}

export interface CompletionGuide {
  controlSource: 'analog' | 'PROFINET' | 'terminal'
  sequence: string[]
  checklist: string[]
}

export const commissioningSource = {
  name: 'SINAMICS G120 CU240B-2 / CU240E-2 Operating Instructions / List Manual',
  url: 'https://sid.siemens.com/v/u/A6V10556727',
}

const direct = (
  code: string,
  nameTr: string,
  value: string | number,
  unit: string | undefined,
  category: CommissioningParameterCategory,
  explanationTr: string,
): CommissioningParameterRecommendation => ({
  code, nameTr, value, unit, category, explanationTr,
  source: commissioningSource.name,
  confidence: 'verified-direct',
  requiresUserConfirmation: false,
})

const informational = (
  code: string,
  nameTr: string,
  explanationTr: string,
  warningTr?: string,
): CommissioningParameterRecommendation => ({
  code, nameTr, value: 'Seçim gerekli', category: 'Kumanda / Kontrol', explanationTr, warningTr,
  source: commissioningSource.name,
  confidence: 'informational',
  requiresUserConfirmation: true,
})

export function createCommissioningParameterPlan(profile: CommissioningProfile): CommissioningParameterPlan {
  const connectionConsistency = evaluateMotorConnectionConsistency(profile)
  const recommendations: CommissioningParameterRecommendation[] = [
    direct('p0010', 'Hızlı devreye alma parametre filtresi', 1, undefined, 'Devreye Alma', 'Hızlı devreye alma parametrelerini görünür hale getirir.'),
    direct('p0100', 'IEC / NEMA motor standardı', 0, undefined, 'Devreye Alma', 'IEC / Europe 50 Hz motor standardı.'),
    direct('p0300', 'Motor tipi', 1, undefined, 'Motor Etiketi', 'IEC asenkron motor seçimine karşılık gelir.'),
    direct('p0304', 'Motor nominal gerilimi', profile.motor.ratedVoltageV!, 'V', 'Motor Etiketi', 'Motor etiketinden doğrudan alındı.'),
    direct('p0305', 'Motor nominal akımı', profile.motor.ratedCurrentA!, 'A', 'Motor Etiketi', 'Motor etiketinden doğrudan alındı.'),
    direct('p0307', 'Motor nominal gücü', profile.motor.ratedPowerKw!, 'kW', 'Motor Etiketi', 'Motor etiketinden doğrudan alındı.'),
    direct('p0310', 'Motor nominal frekansı', profile.motor.ratedFrequencyHz!, 'Hz', 'Motor Etiketi', 'Motor etiketinden doğrudan alındı.'),
    direct('p0311', 'Motor nominal hızı', profile.motor.ratedSpeedRpm!, 'rpm', 'Motor Etiketi', 'Motor etiketinden doğrudan alındı.'),
    direct('p1080', 'Minimum motor hızı', profile.motion.minimumSpeedRpm!, 'rpm', 'Hız / Rampalar', 'Girilen minimum motor hızından alındı.'),
    direct('p1082', 'Maksimum motor hızı', profile.motion.maximumSpeedRpm!, 'rpm', 'Hız / Rampalar', 'Girilen maksimum motor hızından alındı.'),
    direct('p1120', 'Hızlanma rampası', profile.motion.accelerationTimeSec!, 's', 'Hız / Rampalar', 'Girilen hızlanma süresinden alındı.'),
    direct('p1121', 'Yavaşlama rampası', profile.motion.decelerationTimeSec!, 's', 'Hız / Rampalar', 'Girilen yavaşlama süresinden alındı.'),
  ]

  if (profile.motor.powerFactor !== undefined) {
    recommendations.splice(6, 0, direct('p0308', 'Motor nominal cos φ', profile.motor.powerFactor, undefined, 'Motor Etiketi', 'Motor etiketinden doğrudan alındı.'))
  }

  if (connectionConsistency.expectedConnection) {
    recommendations.push({
      code: 'p0133', nameTr: 'Motor konfigürasyonu', value: `Motor bağlantı biti = ${connectionConsistency.expectedConnection === 'Delta' ? 'Delta' : 'Star'}`,
      category: 'Motor Etiketi', source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true,
      explanationTr: 'p0133 motor bağlantı tipini tanımlar. Gerçek terminal bağlantısı sahada doğrulanmadan bu ayar uygulanmamalıdır.',
      warningTr: 'Bu değer, fiziksel terminal kutusu bağlantısının doğrulandığı anlamına gelmez.',
    })
  } else {
    recommendations.push({
      code: 'p0133', nameTr: 'Motor konfigürasyonu', value: 'Bilgi gerekli', category: 'Motor Etiketi', source: commissioningSource.name, confidence: 'informational', requiresUserConfirmation: true,
      explanationTr: 'p0133 motor bağlantı tipini tanımlar. Bağlantı bilgisi güvenilir şekilde belirlenemediği için değer önerilmedi.',
    })
  }

  recommendations.push({
    code: 'p3900', nameTr: 'Hızlı devreye almayı tamamla', value: 'Seçim gerekli', category: 'Devreye Almayı Tamamlama', source: commissioningSource.name,
    confidence: 'conditional', requiresUserConfirmation: true,
    explanationTr: 'Hızlı devreye alma tamamlanır; uygulanacak değer, seçilen CU, firmware ve mevcut makine konfigürasyonuna göre Siemens dokümantasyonundan doğrulanmalıdır.',
    warningTr: 'Mevcut çalışan bir makinede p3900 seçimi bazı mevcut parametre veya I/O ayarlarını etkileyebilir. Değer seçilmeden önce Siemens dokümantasyonu ve mevcut sürücü konfigürasyonu doğrulanmalıdır.',
  })

  const cannotRotateSafely = profile.identification.rotationIsSafe === 'Hayır' || profile.identification.loadCanBeDisconnected === 'Hayır'
  const canRotateSafely = profile.identification.rotationIsSafe === 'Evet' && profile.identification.loadCanBeDisconnected === 'Evet'
  if (canRotateSafely) {
    recommendations.push(
      { code: 'p1900', nameTr: 'Motor data identification - standstill', value: 2, category: 'Motor Identification', source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true, explanationTr: 'Standstill motor identification, dönme gerektirmeden değerlendirilebilen seçenektir.' },
      { code: 'p1900', nameTr: 'Motor data identification + speed-controller optimization', value: 1, category: 'Motor Identification', source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true, explanationTr: 'Yükten ayırma ve motorun dönmesi güvenli olarak doğrulandı.', warningTr: 'Motor identification sırasında motor hareket edebilir. Döner optimizasyon yalnızca çalışma alanı güvenliyse ve Siemens prosedürlerine göre uygulanmalıdır.' },
    )
  } else {
    recommendations.push({
      code: 'p1900', nameTr: 'Motor data identification - standstill', value: 2, category: 'Motor Identification', source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true,
      explanationTr: cannotRotateSafely ? 'Motorun kontrollü şekilde dönmesi güvenli olarak doğrulanmadığı için standstill motor identification tercih edilir.' : 'Motorun dönmesinin güvenli olduğu doğrulanmadı.',
      warningTr: 'Motor identification sırasında motor hareket edebilir. Test koşullarını Siemens prosedürlerine göre doğrulayın.',
    })
  }

  const { controlMethod } = profile.application
  const isVoltageAnalog = controlMethod === 'Terminal + analog 0–10 V'
  const isCurrentAnalog = controlMethod === 'Terminal + analog 4–20 mA'
  const isProfinet = controlMethod === 'PROFINET / PLC'
  const isProfinetControlUnit = profile.drive.controlUnit === 'CU240E-2 PN' || profile.drive.controlUnit === 'CU240E-2 PN-F'
  let analogCommandGuide: AnalogCommandGuide | undefined
  let profinetGuide: ProfinetGuide | undefined
  let profinetWarning: string | undefined
  const completionGuide: CompletionGuide = {
    controlSource: isVoltageAnalog || isCurrentAnalog ? 'analog' : isProfinet ? 'PROFINET' : 'terminal',
    sequence: [
      'Motor etiketi ve sürücü parametrelerini son kez doğrulayın.',
      'Motor terminal bağlantısının Y/Δ etiket bilgisiyle uyumlu olduğunu doğrulayın.',
      `Kumanda kaynağını doğrulayın: ${isVoltageAnalog || isCurrentAnalog ? 'analog' : isProfinet ? 'PROFINET' : 'terminal'}.`,
      'p3900 için uygulanacak tamamlama yöntemini Siemens dokümantasyonuna göre seçin.',
      'p3900 değerini uyguladıktan sonra sürücünün dahili hesaplamaları tamamlamasını bekleyin.',
      'Bu işlem sırasında kısa süreli haberleşme kesintileri olabileceğini kullanıcıya bildirin.',
      'İşlem tamamlandıktan sonra p3900 = 0 ve p0010 = 0 değerlerini doğrulayın.',
      'Sürücü commissioning modundan çıktıktan sonra motor identification planına geçin.',
    ],
    checklist: [
      'Motor etiketi doğrulandı', 'Y/Δ terminal bağlantısı doğrulandı', 'Şebeke gerilimi doğrulandı',
      'Motor akımı / gerilimi / güç / frekans doğrulandı', 'Minimum / maksimum hız doğrulandı',
      'Rampalar doğrulandı', 'Kumanda kaynağı doğrulandı', 'p3900 tamamlandı', 'p0010 = 0 doğrulandı',
      'Safety fonksiyonları ayrı olarak doğrulandı', 'Motor identification koşulları güvenli',
    ],
  }
  if (isVoltageAnalog || isCurrentAnalog) {
    const isCurrent = isCurrentAnalog
    const category: CommissioningParameterCategory = 'Kumanda ve Analog Hız Referansı'
    const hardwareSwitch = isCurrent ? 'I (Current)' : 'U (Voltage)'
    recommendations.push(
      { code: 'p0015', nameTr: 'Sürücü makrosu', value: 12, category, source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true, explanationTr: 'Macro 12 — iki telli kumanda + analog hız referansı. Macro 12, CU240B-2 / CU240E-2 için tipik terminal kumandası ve analog hız referansı başlangıç yapılandırmasıdır.', warningTr: 'Macro seçimi mevcut Control Unit varyantı ve saha kumandasıyla doğrulanmalıdır.' },
      { code: 'p0756[0]', nameTr: 'Analog giriş 0 tipi', value: isCurrent ? 3 : 0, category, source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true, explanationTr: isCurrent ? 'AI0, izlemeli 4–20 mA akım girişi olarak yapılandırılır.' : 'AI0, 0–10 V unipolar gerilim girişi olarak yapılandırılır.' },
      { code: 'p0757[0]', nameTr: 'Analog giriş 0 alt ölçek noktası', value: isCurrent ? 4 : 0, unit: isCurrent ? 'mA' : 'V', category, source: commissioningSource.name, confidence: 'verified-direct', requiresUserConfirmation: false, explanationTr: isCurrent ? '4 mA → 0% ölçeklendirmesinin başlangıç noktasıdır.' : '0 V → 0% ölçeklendirmesinin başlangıç noktasıdır.' },
      { code: 'p0758[0]', nameTr: 'Analog giriş 0 alt yüzde ölçeği', value: 0, unit: '%', category, source: commissioningSource.name, confidence: 'verified-direct', requiresUserConfirmation: false, explanationTr: 'Alt analog giriş değeri için yüzde ölçek değeridir.' },
      { code: 'p0759[0]', nameTr: 'Analog giriş 0 üst ölçek noktası', value: isCurrent ? 20 : 10, unit: isCurrent ? 'mA' : 'V', category, source: commissioningSource.name, confidence: 'verified-direct', requiresUserConfirmation: false, explanationTr: isCurrent ? '20 mA → 100% ölçeklendirmesinin üst noktasıdır.' : '10 V → 100% ölçeklendirmesinin üst noktasıdır.' },
      { code: 'p0760[0]', nameTr: 'Analog giriş 0 üst yüzde ölçeği', value: 100, unit: '%', category, source: commissioningSource.name, confidence: 'verified-direct', requiresUserConfirmation: false, explanationTr: 'Üst analog giriş değeri için yüzde ölçek değeridir.' },
      { code: 'p1000', nameTr: 'Hız referans kaynağı', value: 2, category, source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true, explanationTr: 'Analog setpoint seçimi.' },
      { code: 'r0755[0]', nameTr: 'Analog giriş 0 yüzde gerçek değeri', value: 'İzleme', category, source: commissioningSource.name, confidence: 'informational', requiresUserConfirmation: false, explanationTr: 'Devreye alma sırasında analog sinyalin sürücü tarafından algılanmasını kontrol etmek için kullanılabilir.' },
      { code: 'AI0 U/I', nameTr: 'AI0 fiziksel giriş anahtarı', value: hardwareSwitch, category, source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true, explanationTr: `AI0 fiziksel giriş anahtarı ${hardwareSwitch} konumunda olmalıdır.`, warningTr: 'Bağlantılar yalnızca enerji güvenli şekilde izole edildikten sonra yetkili personel tarafından yapılmalıdır.' },
    )
    if (isCurrent) {
      recommendations.push({ code: 'p0761[0]', nameTr: 'Analog giriş kablo kopukluğu izleme eşiği', value: 'Üretici / uygulama ayarına göre doğrula', category, source: commissioningSource.name, confidence: 'informational', requiresUserConfirmation: true, explanationTr: '4–20 mA analog girişinde kablo kopukluğu izleme eşiği için sayısal değer önerilmez.' })
    }
    analogCommandGuide = {
      mode: isCurrent ? '4–20 mA' : '0–10 V', hardwareSwitch,
      steps: [
        'Sürücüyü ve kontrol devresini güvenli şekilde enerjisiz bırakın.',
        'Seçilen Control Unit ve terminal numaralarını Siemens dokümanından doğrulayın.',
        `AI0 giriş tipi için fiziksel U/I anahtarının ${isCurrent ? 'I' : 'U'} konumunda olduğunu doğrulayın.`,
        `p0756[0] = ${isCurrent ? 3 : 0} değerini doğrulayın.`,
        isCurrent ? '4–20 mA ölçeklendirmesini kontrol edin.' : '0–10 V ölçeklendirmesini kontrol edin.',
        'Sürücü enerjilendirildiğinde r0755[0] üzerinden analog giriş gerçek değerini gözlemleyin.',
        'Hız referansının proses yönü ve maksimum hız sınırlarıyla uyumlu olduğunu doğrulayın.',
      ],
    }
  } else if (isProfinet && isProfinetControlUnit) {
    const category: CommissioningParameterCategory = 'PROFINET / PLC Kumandası'
    recommendations.push(
      { code: 'p0015', nameTr: 'Sürücü makrosu', value: 7, category, source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true, explanationTr: 'G120 fieldbus commissioning için kullanılan standart başlangıç makrosudur. Seçilen Control Unit ve mevcut saha/PLC yapılandırmasıyla doğrulanmalıdır.', warningTr: 'p0015 tek başına PROFINET devreye almasını tamamlamaz.' },
      { code: 'p0922', nameTr: 'PROFIdrive telegram seçimi', value: 1, category, source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true, explanationTr: 'Standard Telegram 1 — PZD 2/2. Temel hız kontrolü için iki PZD kelimesini her yönde kullanır.' },
    )
    profinetGuide = {
      checklist: [
        "Seçilen Control Unit'in CU240E-2 PN veya PN-F olduğunu doğrulayın.",
        'G120 ve PLC’nin PROFINET bağlantısını fiziksel olarak kontrol edin.',
        'TIA Portal / engineering project içinde sürücünün doğru cihaz adı (PROFINET device name) ve IP yapılandırmasını doğrulayın.',
        'Donanım yapılandırmasında PLC ile G120 arasında seçilen telegramın aynı olduğunu doğrulayın.',
        'Temel hız kontrolü için Standard Telegram 1 kullanılıyorsa p0922 = 1 değerini doğrulayın.',
        'PLC tarafından gönderilen control word durumunu doğrulayın.',
        'Sürücü status word bilgisini PLC tarafında izleyin.',
        'Hız setpoint’inin doğru yönde ve izin verilen hız sınırlarında olduğunu doğrulayın.',
        'Haberleşme kesildiğinde sürücünün tesis güvenlik/proses stratejisine uygun davranış gösterdiğini doğrulayın.',
      ],
    }
  } else if (isProfinet) {
    profinetWarning = 'Seçilen Control Unit PROFINET varyantı olarak doğrulanmadı. PROFINET devreye alma rehberi için CU240E-2 PN veya CU240E-2 PN-F seçilmelidir.'
  } else {
    recommendations.push(informational('p0015', 'Kumanda makrosu', 'Seçilen kontrol yöntemi için doğrulanmış bir makro eşlemesi bulunmadığından manuel seçim gerekir.'))
  }

  recommendations.push(
    { code: 'p1300', nameTr: 'Kontrol modu', value: 'Seçim gerekli', category: 'Kumanda / Kontrol', source: commissioningSource.name, confidence: 'informational', requiresUserConfirmation: true, explanationTr: 'Doğrusal U/f (0), U/f + FCC (1), parabolik U/f (2) ve enkodersiz hız kontrolü (20) yaygın seçeneklerdir. Kontrol modu uygulama dinamiği, motor ve proses gereksinimlerine göre seçilmelidir.' },
    { code: 'p0335', nameTr: 'Motor soğutma tipi', value: 'Bilgi gerekli', category: 'Motor Etiketi', source: commissioningSource.name, confidence: 'informational', requiresUserConfirmation: true, explanationTr: 'Motor soğutma tipi bilgisi girilmedi.' },
    { code: 'p0625', nameTr: 'Motor ortam sıcaklığı', value: 'Bilgi gerekli', category: 'Motor Etiketi', source: commissioningSource.name, confidence: 'informational', requiresUserConfirmation: true, explanationTr: 'Motor ortam sıcaklığı bilgisi girilmedi.' },
  )

  return {
    recommendations,
    warnings: [
      'Motor terminal bağlantısı motor etiketine ve gerçek terminal kutusu bağlantısına göre sahada doğrulanmalıdır.',
      ...(profile.motion.maximumSpeedRpm !== undefined && profile.motor.ratedSpeedRpm !== undefined && profile.motion.maximumSpeedRpm > profile.motor.ratedSpeedRpm ? ['87 Hz çalışma ayrı bir gelişmiş devreye alma senaryosudur ve bu V1 planında etkinleştirilmez.'] : []),
    ],
    sourceName: commissioningSource.name,
    sourceUrl: commissioningSource.url,
    analogCommandGuide,
    profinetGuide,
    profinetWarning,
    completionGuide,
  }
}
