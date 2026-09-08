import type { CommissioningProfile } from './commissioningTypes'

export type CommissioningParameterConfidence = 'verified-direct' | 'conditional' | 'informational'
export type CommissioningParameterCategory = 'Devreye Alma' | 'Motor Etiketi' | 'Hız / Rampalar' | 'Kumanda / Kontrol' | 'Motor Identification'

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
  if ((controlMethod === 'Terminal + analog 0–10 V' || controlMethod === 'Terminal + analog 4–20 mA') && profile.drive.controlUnit === 'CU240E-2') {
    recommendations.push({ code: 'p0015', nameTr: 'Standard I/O with analog setpoint', value: 12, category: 'Kumanda / Kontrol', source: commissioningSource.name, confidence: 'conditional', requiresUserConfirmation: true, explanationTr: 'Macro 12 standard I/O ile analog setpoint yapılandırmasını seçer. Analog giriş sinyal tipi ayrıca doğrulanmalıdır.', warningTr: 'Analog giriş sinyal tipi ve saha bağlantısı doğrulanmalıdır.' })
  } else if (controlMethod === 'PROFINET / PLC') {
    recommendations.push(informational('p0015', 'Fieldbus macro', 'Fieldbus macro seçimi için Control Unit haberleşme varyantının doğrulanması gerekir.'))
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
    warnings: ['Motor terminal bağlantısı motor etiketine ve gerçek terminal kutusu bağlantısına göre sahada doğrulanmalıdır.'],
    sourceName: commissioningSource.name,
    sourceUrl: commissioningSource.url,
  }
}
