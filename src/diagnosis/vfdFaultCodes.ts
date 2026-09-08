export type VfdManufacturer = 'siemens' | 'yaskawa' | 'danfoss'
export type VfdModelFamily = 'SINAMICS G120' | 'V1000' | 'VLT AutomationDrive FC 302'

export interface ManufacturerFaultCode {
  manufacturer: string
  modelFamily: VfdModelFamily
  code: string
  title: string
  titleTr: string
  description: string
  recommendedChecks: string[]
  sourceName: string
  sourceUrl: string
}

const siemensSource = {
  sourceName: 'Siemens SINAMICS G120 Operating Instructions',
  sourceUrl: 'https://sid.siemens.com/v/u/A6V10556727',
}

const yaskawaSource = {
  sourceName: 'Yaskawa V1000 Technical Manual',
  sourceUrl: 'https://www.yaskawa.com/delegate/getAttachment?cmd=documents&documentId=SIEPC71060618&documentName=SIEPC71060618.pdf',
}

const danfossSource = {
  sourceName: 'Danfoss VLT AutomationDrive FC 302 documentation',
  sourceUrl: 'https://www.danfoss.com/en-gb/products/dds/low-voltage-drives/vlt-drives/vlt-automationdrive-fc-301-fc-302/',
}

export const manufacturerFaultCodes: ManufacturerFaultCode[] = [
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30002', title: 'DC link overvoltage', titleTr: 'DC bara aşırı gerilimi', description: 'DC link voltage is reported above the permitted operating condition.', recommendedChecks: ['Besleme gerilimini ve rejeneratif yük koşullarını yetkili personelle değerlendirin.', 'Frenleme ve enerji geri besleme koşullarını üretici dokümantasyonuna göre inceleyin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30003', title: 'DC link undervoltage', titleTr: 'DC bara düşük gerilimi', description: 'DC link voltage is reported below the expected operating condition.', recommendedChecks: ['Sürücü girişindeki besleme gerilimini yetkili elektrik personeliyle kontrol edin.', 'Besleme bağlantıları ve koruma elemanlarını tesis prosedürlerine göre inceleyin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07807', title: 'Short-circuit / ground fault detected', titleTr: 'Kısa devre / toprak hatası algılandı', description: 'Drive reports a possible output short-circuit or ground fault.', recommendedChecks: ['Enerji izolasyonu sonrası motor ve kablo devresini yetkili personelle inceleyin.', 'İzolasyon ve topraklama kontrollerini üretici prosedürlerine göre planlayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07900', title: 'Motor blocked', titleTr: 'Motor bloke', description: 'Drive reports that the motor cannot rotate as expected.', recommendedChecks: ['Enerji izolasyonu altında tahrik edilen mekanizmanın serbestliğini kontrol edin.', 'Motor yükü ve mekanik aktarma elemanlarını yetkili bakım personeliyle değerlendirin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07902', title: 'Motor stalled', titleTr: 'Motor stall / motor hareket edemiyor', description: 'Drive reports a motor stall condition.', recommendedChecks: ['Yük, hızlanma ayarları ve mekanik direnç koşullarını inceleyin.', 'Motor akımını ve sürücü parametrelerini yetkili personelle karşılaştırın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F08501', title: 'Setpoint timeout', titleTr: 'Set değeri zaman aşımı / haberleşme kontrol problemi', description: 'The expected setpoint signal was not received in time.', recommendedChecks: ['Referans kaynağı ve haberleşme bağlantısını yetkili personelle doğrulayın.', 'Kontrol modu ve setpoint zaman aşımı parametrelerini inceleyin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F08502', title: 'Monitoring time / sign-of-life expired', titleTr: 'Haberleşme yaşam sinyali zaman aşımı', description: 'The monitored communication sign-of-life signal expired.', recommendedChecks: ['Haberleşme hattı, terminasyon ve kontrolör durumunu inceleyin.', 'İletişim izleme ayarlarını üretici dokümantasyonuna göre doğrulayın.'], ...siemensSource },

  { manufacturer: 'Yaskawa', modelFamily: 'V1000', code: 'Uv1', title: 'DC Bus Undervoltage', titleTr: 'DC bara düşük gerilimi', description: 'Drive reports DC bus undervoltage.', recommendedChecks: ['Giriş beslemesini ve bağlantıları yetkili elektrik personeliyle kontrol edin.'], ...yaskawaSource },
  { manufacturer: 'Yaskawa', modelFamily: 'V1000', code: 'GF', title: 'Ground Fault', titleTr: 'Toprak hatası', description: 'Drive reports a ground fault on the motor side.', recommendedChecks: ['Enerji izolasyonu sonrası motor ve kablo devresini yetkili personelle inceleyin.'], ...yaskawaSource },
  { manufacturer: 'Yaskawa', modelFamily: 'V1000', code: 'oC', title: 'Overcurrent', titleTr: 'Aşırı akım', description: 'Drive reports overcurrent.', recommendedChecks: ['Motor yükünü, kabloyu ve hızlanma/yavaşlama ayarlarını inceleyin.'], ...yaskawaSource },
  { manufacturer: 'Yaskawa', modelFamily: 'V1000', code: 'ov', title: 'DC Bus Overvoltage', titleTr: 'DC bara aşırı gerilimi', description: 'Drive reports DC bus overvoltage.', recommendedChecks: ['Giriş gerilimi ve yavaşlama koşullarını yetkili personelle değerlendirin.'], ...yaskawaSource },
  { manufacturer: 'Yaskawa', modelFamily: 'V1000', code: 'oH1', title: 'Heatsink Overtemperature', titleTr: 'Soğutucu aşırı sıcaklığı', description: 'Drive reports heatsink overtemperature.', recommendedChecks: ['Sürücü soğutmasını, fanları ve pano hava akışını inceleyin.'], ...yaskawaSource },
  { manufacturer: 'Yaskawa', modelFamily: 'V1000', code: 'oL1', title: 'Motor Overload', titleTr: 'Motor aşırı yükü', description: 'Drive reports motor overload.', recommendedChecks: ['Motor yükü, çalışma çevrimi ve motor anma akımını karşılaştırın.'], ...yaskawaSource },
  { manufacturer: 'Yaskawa', modelFamily: 'V1000', code: 'oL2', title: 'Drive Overload', titleTr: 'Sürücü aşırı yükü', description: 'Drive reports drive overload.', recommendedChecks: ['Sürücü yükü, çalışma çevrimi ve sürücü boyutlandırmasını inceleyin.'], ...yaskawaSource },
  { manufacturer: 'Yaskawa', modelFamily: 'V1000', code: 'PF', title: 'Input Phase Loss', titleTr: 'Giriş faz kaybı', description: 'Drive reports input phase loss.', recommendedChecks: ['Giriş fazlarını ve besleme bağlantılarını yetkili elektrik personeliyle doğrulayın.'], ...yaskawaSource },
  { manufacturer: 'Yaskawa', modelFamily: 'V1000', code: 'LF', title: 'Output Phase Loss', titleTr: 'Çıkış faz kaybı', description: 'Drive reports output phase loss.', recommendedChecks: ['Motor çıkış kablosu, motor bağlantıları ve akım ölçümlerini inceleyin.'], ...yaskawaSource },

  { manufacturer: 'Danfoss', modelFamily: 'VLT AutomationDrive FC 302', code: '4', title: 'Mains phase loss', titleTr: 'Şebeke faz kaybı', description: 'Drive reports mains phase loss.', recommendedChecks: ['Şebeke fazlarını ve giriş bağlantılarını yetkili elektrik personeliyle doğrulayın.'], ...danfossSource },
  { manufacturer: 'Danfoss', modelFamily: 'VLT AutomationDrive FC 302', code: '5', title: 'DC link voltage high', titleTr: 'DC bara gerilimi yüksek', description: 'Drive reports high DC link voltage.', recommendedChecks: ['Besleme gerilimi ve rejeneratif koşulları yetkili personelle değerlendirin.'], ...danfossSource },
  { manufacturer: 'Danfoss', modelFamily: 'VLT AutomationDrive FC 302', code: '6', title: 'DC link voltage low', titleTr: 'DC bara gerilimi düşük', description: 'Drive reports low DC link voltage.', recommendedChecks: ['Giriş beslemesini ve koruma elemanlarını tesis prosedürlerine göre inceleyin.'], ...danfossSource },
  { manufacturer: 'Danfoss', modelFamily: 'VLT AutomationDrive FC 302', code: '7', title: 'DC overvoltage', titleTr: 'DC aşırı gerilim', description: 'Drive reports DC overvoltage.', recommendedChecks: ['Besleme ve yavaşlama koşullarını yetkili personelle inceleyin.'], ...danfossSource },
  { manufacturer: 'Danfoss', modelFamily: 'VLT AutomationDrive FC 302', code: '8', title: 'DC undervoltage', titleTr: 'DC düşük gerilim', description: 'Drive reports DC undervoltage.', recommendedChecks: ['Besleme hattını ve giriş gerilimini yetkili elektrik personeliyle doğrulayın.'], ...danfossSource },
  { manufacturer: 'Danfoss', modelFamily: 'VLT AutomationDrive FC 302', code: '9', title: 'Inverter overload', titleTr: 'İnverter aşırı yükü', description: 'Drive reports inverter overload.', recommendedChecks: ['Sürücü yükü ve çalışma çevrimini üretici sınırlarına göre değerlendirin.'], ...danfossSource },
  { manufacturer: 'Danfoss', modelFamily: 'VLT AutomationDrive FC 302', code: '13', title: 'Overcurrent', titleTr: 'Aşırı akım', description: 'Drive reports overcurrent.', recommendedChecks: ['Motor, kablo ve mekanik yük koşullarını yetkili personelle inceleyin.'], ...danfossSource },
]

export function normalizeFaultCode(value: string): string {
  return value.trim().replaceAll(' ', '').toUpperCase()
}

export function lookupManufacturerFaultCode(
  manufacturer: VfdManufacturer | '',
  modelFamily: VfdModelFamily | '',
  rawCode: string,
): ManufacturerFaultCode | undefined {
  const normalizedInput = normalizeFaultCode(rawCode)
  return manufacturerFaultCodes.find(
    (entry) =>
      entry.manufacturer.toLocaleLowerCase('tr-TR') === manufacturer &&
      entry.modelFamily === modelFamily &&
      normalizeFaultCode(entry.code) === normalizedInput,
  )
}
