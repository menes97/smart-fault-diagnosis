export interface G120ExtendedFaultCode {
  manufacturer: 'Siemens'
  modelFamily: 'SINAMICS G120'
  code: string
  title: string
  titleTr: string
  description: string
  descriptionTr: string
  recommendedChecks: string[]
  sourceName: string
  sourceUrl: string
  sourceDocument: string
  sourceScope: string
  sourceSection: string
  safetyNoteTr?: string
}

const source = {
  sourceName: 'Siemens SINAMICS G120 CU240B-2 / CU240E-2 List Manual',
  sourceUrl: 'https://support.industry.siemens.com/cs/attachments/109782301/G120_CU240BE-2_List_Manual_0920_en_US.pdf',
  sourceDocument: 'SINAMICS G120 Control Units CU240B-2 / CU240E-2 List Manual',
  sourceScope: 'CU240B-2 / CU240E-2 family; applicability can depend on CU variant and firmware',
  sourceSection: 'Faults and alarms',
} as const

export const g120ExtendedFaultCodes: G120ExtendedFaultCode[] = [
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01000', title: 'Internal software error', titleTr: 'Dahili yazılım hatası',
    description: 'Internal software error', descriptionTr: 'Siemens SINAMICS G120, F01000 koduyla “Dahili yazılım hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01001', title: 'FloatingPoint exception', titleTr: 'FloatingPoint işlem hatası',
    description: 'FloatingPoint exception', descriptionTr: 'Siemens SINAMICS G120, F01001 koduyla “FloatingPoint işlem hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01002', title: 'Internal software error', titleTr: 'Dahili yazılım hatası',
    description: 'Internal software error', descriptionTr: 'Siemens SINAMICS G120, F01002 koduyla “Dahili yazılım hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01003', title: 'Acknowledgement delay when accessing the memory', titleTr: 'Bellek erişiminde onay gecikmesi',
    description: 'Acknowledgement delay when accessing the memory', descriptionTr: 'Siemens SINAMICS G120, F01003 koduyla “Bellek erişiminde onay gecikmesi” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01005', title: 'File upload/download error', titleTr: 'Dosya yükleme/indirme hatası',
    description: 'File upload/download error', descriptionTr: 'Siemens SINAMICS G120, F01005 koduyla “Dosya yükleme/indirme hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01010', title: 'Drive type unknown', titleTr: 'Sürücü tipi tanınmıyor',
    description: 'Drive type unknown', descriptionTr: 'Siemens SINAMICS G120, F01010 koduyla “Sürücü tipi tanınmıyor” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01015', title: 'Internal software error', titleTr: 'Dahili yazılım hatası',
    description: 'Internal software error', descriptionTr: 'Siemens SINAMICS G120, F01015 koduyla “Dahili yazılım hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01023', title: 'Software timeout (internal)', titleTr: 'Dahili yazılım zaman aşımı',
    description: 'Software timeout (internal)', descriptionTr: 'Siemens SINAMICS G120, F01023 koduyla “Dahili yazılım zaman aşımı” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01030', title: 'Sign-of-life failure for master control', titleTr: 'Ana kontrol yaşam sinyali hatası',
    description: 'Sign-of-life failure for master control', descriptionTr: 'Siemens SINAMICS G120, F01030 koduyla “Ana kontrol yaşam sinyali hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01033', title: 'Units changeover: Reference parameter value invalid', titleTr: 'Birim dönüşümü: referans parametre değeri geçersiz',
    description: 'Units changeover: Reference parameter value invalid', descriptionTr: 'Siemens SINAMICS G120, F01033 koduyla “Birim dönüşümü: referans parametre değeri geçersiz” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01034', title: 'Units changeover: Calculation of parameter values after reference value change unsuccessful', titleTr: 'Birim dönüşümü: referans değişimi sonrası parametre hesabı başarısız',
    description: 'Units changeover: Calculation of parameter values after reference value change unsuccessful', descriptionTr: 'Siemens SINAMICS G120, F01034 koduyla “Birim dönüşümü: referans değişimi sonrası parametre hesabı başarısız” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01036', title: 'ACX: Parameter back-up file missing', titleTr: 'ACX parametre yedek dosyası eksik',
    description: 'ACX: Parameter back-up file missing', descriptionTr: 'Siemens SINAMICS G120, F01036 koduyla “ACX parametre yedek dosyası eksik” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01038', title: 'ACX: Loading the parameter back-up file unsuccessful', titleTr: 'ACX parametre yedeği yüklenemedi',
    description: 'ACX: Loading the parameter back-up file unsuccessful', descriptionTr: 'Siemens SINAMICS G120, F01038 koduyla “ACX parametre yedeği yüklenemedi” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01039', title: 'ACX: Writing to the parameter back-up file was unsuccessful', titleTr: 'ACX parametre yedeğine yazılamadı',
    description: 'ACX: Writing to the parameter back-up file was unsuccessful', descriptionTr: 'Siemens SINAMICS G120, F01039 koduyla “ACX parametre yedeğine yazılamadı” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01040', title: 'Save parameter settings and carry out a POWER ON', titleTr: 'Parametreleri kaydedin ve POWER ON uygulayın',
    description: 'Save parameter settings and carry out a POWER ON', descriptionTr: 'Siemens SINAMICS G120, F01040 koduyla “Parametreleri kaydedin ve POWER ON uygulayın” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01042', title: 'Parameter error during project download', titleTr: 'Proje indirme sırasında parametre hatası',
    description: 'Parameter error during project download', descriptionTr: 'Siemens SINAMICS G120, F01042 koduyla “Proje indirme sırasında parametre hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01043', title: 'Fatal error at project download', titleTr: 'Proje indirme sırasında kritik hata',
    description: 'Fatal error at project download', descriptionTr: 'Siemens SINAMICS G120, F01043 koduyla “Proje indirme sırasında kritik hata” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01044', title: 'CU: Descriptive data error', titleTr: 'CU açıklayıcı veri hatası',
    description: 'CU: Descriptive data error', descriptionTr: 'Siemens SINAMICS G120, F01044 koduyla “CU açıklayıcı veri hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01054', title: 'CU: System limit exceeded', titleTr: 'CU sistem limiti aşıldı',
    description: 'CU: System limit exceeded', descriptionTr: 'Siemens SINAMICS G120, F01054 koduyla “CU sistem limiti aşıldı” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01068', title: 'CU: Data memory memory overflow', titleTr: 'CU veri belleği taşması',
    description: 'CU: Data memory memory overflow', descriptionTr: 'Siemens SINAMICS G120, F01068 koduyla “CU veri belleği taşması” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01072', title: 'Memory card restored from the backup copy', titleTr: 'Hafıza kartı yedek kopyadan geri yüklendi',
    description: 'Memory card restored from the backup copy', descriptionTr: 'Siemens SINAMICS G120, F01072 koduyla “Hafıza kartı yedek kopyadan geri yüklendi” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01105', title: 'CU: Insufficient memory', titleTr: 'CU belleği yetersiz',
    description: 'CU: Insufficient memory', descriptionTr: 'Siemens SINAMICS G120, F01105 koduyla “CU belleği yetersiz” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01107', title: 'Save to memory card unsuccessful', titleTr: 'Hafıza kartına kaydetme başarısız',
    description: 'Save to memory card unsuccessful', descriptionTr: 'Siemens SINAMICS G120, F01107 koduyla “Hafıza kartına kaydetme başarısız” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01112', title: 'CU: Power unit not permissible', titleTr: 'CU için güç ünitesi uygun değil',
    description: 'CU: Power unit not permissible', descriptionTr: 'Siemens SINAMICS G120, F01112 koduyla “CU için güç ünitesi uygun değil” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01120', title: 'Terminal initialization has failed', titleTr: 'Terminal başlatma başarısız',
    description: 'Terminal initialization has failed', descriptionTr: 'Siemens SINAMICS G120, F01120 koduyla “Terminal başlatma başarısız” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01205', title: 'CU: Time slice overflow', titleTr: 'CU zaman dilimi aşımı',
    description: 'CU: Time slice overflow', descriptionTr: 'Siemens SINAMICS G120, F01205 koduyla “CU zaman dilimi aşımı” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01250', title: 'CU: CU-EEPROM incorrect read-only data', titleTr: 'CU EEPROM salt-okunur veri hatası',
    description: 'CU: CU-EEPROM incorrect read-only data', descriptionTr: 'Siemens SINAMICS G120, F01250 koduyla “CU EEPROM salt-okunur veri hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01257', title: 'CU: Firmware version out of date', titleTr: 'CU firmware sürümü güncel değil',
    description: 'CU: Firmware version out of date', descriptionTr: 'Siemens SINAMICS G120, F01257 koduyla “CU firmware sürümü güncel değil” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01340', title: 'Topology: Too many components on one line', titleTr: 'Topoloji: bir hatta çok fazla bileşen',
    description: 'Topology: Too many components on one line', descriptionTr: 'Siemens SINAMICS G120, F01340 koduyla “Topoloji: bir hatta çok fazla bileşen” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01505', title: 'BICO: Interconnection cannot be established', titleTr: 'BICO bağlantısı kurulamıyor',
    description: 'BICO: Interconnection cannot be established', descriptionTr: 'Siemens SINAMICS G120, F01505 koduyla “BICO bağlantısı kurulamıyor” durumunu bildiriyor.',
    recommendedChecks: ['BICO bağlantılarını, sinyal kaynaklarını ve ölçeklendirmeleri proje yapılandırmasıyla karşılaştırın.', 'Parametre değişikliği yapmadan önce mevcut sürücü konfigürasyonunu yedeklayın ve Siemens dokümantasyonunu doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01510', title: 'BICO: Signal source is not float type', titleTr: 'BICO sinyal kaynağı float tipinde değil',
    description: 'BICO: Signal source is not float type', descriptionTr: 'Siemens SINAMICS G120, F01510 koduyla “BICO sinyal kaynağı float tipinde değil” durumunu bildiriyor.',
    recommendedChecks: ['BICO bağlantılarını, sinyal kaynaklarını ve ölçeklendirmeleri proje yapılandırmasıyla karşılaştırın.', 'Parametre değişikliği yapmadan önce mevcut sürücü konfigürasyonunu yedeklayın ve Siemens dokümantasyonunu doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01511', title: 'BICO: Interconnection with different scalings', titleTr: 'BICO farklı ölçeklerle bağlantı hatası',
    description: 'BICO: Interconnection with different scalings', descriptionTr: 'Siemens SINAMICS G120, F01511 koduyla “BICO farklı ölçeklerle bağlantı hatası” durumunu bildiriyor.',
    recommendedChecks: ['BICO bağlantılarını, sinyal kaynaklarını ve ölçeklendirmeleri proje yapılandırmasıyla karşılaştırın.', 'Parametre değişikliği yapmadan önce mevcut sürücü konfigürasyonunu yedeklayın ve Siemens dokümantasyonunu doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01512', title: 'BICO: No scaling available', titleTr: 'BICO ölçeklendirme bilgisi yok',
    description: 'BICO: No scaling available', descriptionTr: 'Siemens SINAMICS G120, F01512 koduyla “BICO ölçeklendirme bilgisi yok” durumunu bildiriyor.',
    recommendedChecks: ['BICO bağlantılarını, sinyal kaynaklarını ve ölçeklendirmeleri proje yapılandırmasıyla karşılaştırın.', 'Parametre değişikliği yapmadan önce mevcut sürücü konfigürasyonunu yedeklayın ve Siemens dokümantasyonunu doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01513', title: 'BICO: Interconnection cross DO with different scalings', titleTr: 'BICO farklı ölçekli DO çapraz bağlantı hatası',
    description: 'BICO: Interconnection cross DO with different scalings', descriptionTr: 'Siemens SINAMICS G120, F01513 koduyla “BICO farklı ölçekli DO çapraz bağlantı hatası” durumunu bildiriyor.',
    recommendedChecks: ['BICO bağlantılarını, sinyal kaynaklarını ve ölçeklendirmeleri proje yapılandırmasıyla karşılaştırın.', 'Parametre değişikliği yapmadan önce mevcut sürücü konfigürasyonunu yedeklayın ve Siemens dokümantasyonunu doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01515', title: 'BICO: Writing to parameter not permitted as the master control is active', titleTr: 'Ana kontrol aktifken BICO parametresine yazma izinli değil',
    description: 'BICO: Writing to parameter not permitted as the master control is active', descriptionTr: 'Siemens SINAMICS G120, F01515 koduyla “Ana kontrol aktifken BICO parametresine yazma izinli değil” durumunu bildiriyor.',
    recommendedChecks: ['BICO bağlantılarını, sinyal kaynaklarını ve ölçeklendirmeleri proje yapılandırmasıyla karşılaştırın.', 'Parametre değişikliği yapmadan önce mevcut sürücü konfigürasyonunu yedeklayın ve Siemens dokümantasyonunu doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01611', title: 'SI P1: Defect in a monitoring channel', titleTr: 'Safety P1 izleme kanalı arızası',
    description: 'SI P1: Defect in a monitoring channel', descriptionTr: 'Siemens SINAMICS G120, F01611 koduyla “Safety P1 izleme kanalı arızası” durumunu bildiriyor.',
    recommendedChecks: ['Aktif Safety Integrated fonksiyonunu ve ilgili fault value bilgisini Siemens dokümantasyonuna göre doğrulayın.', 'STO/PROFIsafe veya failsafe girişlerini yalnızca yetkili personelle değerlendirin.'], ...source,
    safetyNoteTr: 'Safety Integrated fonksiyonlarını baypas etmeyin veya devre dışı bırakmayın. Arıza yalnızca yetkili safety personeli tarafından değerlendirilmelidir.',
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01625', title: 'SI P1: Sign-of-life error in safety data', titleTr: 'Safety P1 yaşam sinyali hatası',
    description: 'SI P1: Sign-of-life error in safety data', descriptionTr: 'Siemens SINAMICS G120, F01625 koduyla “Safety P1 yaşam sinyali hatası” durumunu bildiriyor.',
    recommendedChecks: ['Aktif Safety Integrated fonksiyonunu ve ilgili fault value bilgisini Siemens dokümantasyonuna göre doğrulayın.', 'STO/PROFIsafe veya failsafe girişlerini yalnızca yetkili personelle değerlendirin.'], ...source,
    safetyNoteTr: 'Safety Integrated fonksiyonlarını baypas etmeyin veya devre dışı bırakmayın. Arıza yalnızca yetkili safety personeli tarafından değerlendirilmelidir.',
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01650', title: 'SI P1: Acceptance test required', titleTr: 'Safety P1 kabul testi gerekli',
    description: 'SI P1: Acceptance test required', descriptionTr: 'Siemens SINAMICS G120, F01650 koduyla “Safety P1 kabul testi gerekli” durumunu bildiriyor.',
    recommendedChecks: ['Aktif Safety Integrated fonksiyonunu ve ilgili fault value bilgisini Siemens dokümantasyonuna göre doğrulayın.', 'STO/PROFIsafe veya failsafe girişlerini yalnızca yetkili personelle değerlendirin.'], ...source,
    safetyNoteTr: 'Safety Integrated fonksiyonlarını baypas etmeyin veya devre dışı bırakmayın. Arıza yalnızca yetkili safety personeli tarafından değerlendirilmelidir.',
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01653', title: 'SI P1: PROFIBUS/PROFINET configuration error', titleTr: 'Safety P1 PROFIBUS/PROFINET yapılandırma hatası',
    description: 'SI P1: PROFIBUS/PROFINET configuration error', descriptionTr: 'Siemens SINAMICS G120, F01653 koduyla “Safety P1 PROFIBUS/PROFINET yapılandırma hatası” durumunu bildiriyor.',
    recommendedChecks: ['Aktif Safety Integrated fonksiyonunu ve ilgili fault value bilgisini Siemens dokümantasyonuna göre doğrulayın.', 'STO/PROFIsafe veya failsafe girişlerini yalnızca yetkili personelle değerlendirin.'], ...source,
    safetyNoteTr: 'Safety Integrated fonksiyonlarını baypas etmeyin veya devre dışı bırakmayın. Arıza yalnızca yetkili safety personeli tarafından değerlendirilmelidir.',
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01658', title: 'SI P1: PROFIsafe telegram number not suitable', titleTr: 'Safety P1 PROFIsafe telegram numarası uygun değil',
    description: 'SI P1: PROFIsafe telegram number not suitable', descriptionTr: 'Siemens SINAMICS G120, F01658 koduyla “Safety P1 PROFIsafe telegram numarası uygun değil” durumunu bildiriyor.',
    recommendedChecks: ['Aktif Safety Integrated fonksiyonunu ve ilgili fault value bilgisini Siemens dokümantasyonuna göre doğrulayın.', 'STO/PROFIsafe veya failsafe girişlerini yalnızca yetkili personelle değerlendirin.'], ...source,
    safetyNoteTr: 'Safety Integrated fonksiyonlarını baypas etmeyin veya devre dışı bırakmayın. Arıza yalnızca yetkili safety personeli tarafından değerlendirilmelidir.',
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01660', title: 'SI P1: Safety-related functions not supported', titleTr: 'Safety P1 güvenlik fonksiyonları desteklenmiyor',
    description: 'SI P1: Safety-related functions not supported', descriptionTr: 'Siemens SINAMICS G120, F01660 koduyla “Safety P1 güvenlik fonksiyonları desteklenmiyor” durumunu bildiriyor.',
    recommendedChecks: ['Aktif Safety Integrated fonksiyonunu ve ilgili fault value bilgisini Siemens dokümantasyonuna göre doğrulayın.', 'STO/PROFIsafe veya failsafe girişlerini yalnızca yetkili personelle değerlendirin.'], ...source,
    safetyNoteTr: 'Safety Integrated fonksiyonlarını baypas etmeyin veya devre dışı bırakmayın. Arıza yalnızca yetkili safety personeli tarafından değerlendirilmelidir.',
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01662', title: 'Error internal communications', titleTr: 'Dahili haberleşme hatası',
    description: 'Error internal communications', descriptionTr: 'Siemens SINAMICS G120, F01662 koduyla “Dahili haberleşme hatası” durumunu bildiriyor.',
    recommendedChecks: ['Aktif Safety Integrated fonksiyonunu ve ilgili fault value bilgisini Siemens dokümantasyonuna göre doğrulayın.', 'STO/PROFIsafe veya failsafe girişlerini yalnızca yetkili personelle değerlendirin.'], ...source,
    safetyNoteTr: 'Safety Integrated fonksiyonlarını baypas etmeyin veya devre dışı bırakmayın. Arıza yalnızca yetkili safety personeli tarafından değerlendirilmelidir.',
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01665', title: 'SI P1: System is defective', titleTr: 'Safety P1 sistem arızası',
    description: 'SI P1: System is defective', descriptionTr: 'Siemens SINAMICS G120, F01665 koduyla “Safety P1 sistem arızası” durumunu bildiriyor.',
    recommendedChecks: ['Aktif Safety Integrated fonksiyonunu ve ilgili fault value bilgisini Siemens dokümantasyonuna göre doğrulayın.', 'STO/PROFIsafe veya failsafe girişlerini yalnızca yetkili personelle değerlendirin.'], ...source,
    safetyNoteTr: 'Safety Integrated fonksiyonlarını baypas etmeyin veya devre dışı bırakmayın. Arıza yalnızca yetkili safety personeli tarafından değerlendirilmelidir.',
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01946', title: 'PROFIBUS: Connection to the Publisher aborted', titleTr: 'PROFIBUS Publisher bağlantısı kesildi',
    description: 'PROFIBUS: Connection to the Publisher aborted', descriptionTr: 'Siemens SINAMICS G120, F01946 koduyla “PROFIBUS Publisher bağlantısı kesildi” durumunu bildiriyor.',
    recommendedChecks: ['PLC/fieldbus bağlantısını, telegram durumunu ve ana kontrol sinyalini kontrol edin.', 'Kablo, cihaz adı/adres ve haberleşme yapılandırmasını proje dokümantasyonuna göre doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01951', title: 'CU SYNC: Synchronization application clock cycle missing', titleTr: 'CU SYNC uygulama saat çevrimi eksik',
    description: 'CU SYNC: Synchronization application clock cycle missing', descriptionTr: 'Siemens SINAMICS G120, F01951 koduyla “CU SYNC uygulama saat çevrimi eksik” durumunu bildiriyor.',
    recommendedChecks: ['PLC/fieldbus bağlantısını, telegram durumunu ve ana kontrol sinyalini kontrol edin.', 'Kablo, cihaz adı/adres ve haberleşme yapılandırmasını proje dokümantasyonuna göre doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F02151', title: 'OA: Internal software error', titleTr: 'OA dahili yazılım hatası',
    description: 'OA: Internal software error', descriptionTr: 'Siemens SINAMICS G120, F02151 koduyla “OA dahili yazılım hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F02152', title: 'OA: Insufficient memory', titleTr: 'OA belleği yetersiz',
    description: 'OA: Insufficient memory', descriptionTr: 'Siemens SINAMICS G120, F02152 koduyla “OA belleği yetersiz” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F03000', title: 'NVRAM fault on action', titleTr: 'NVRAM işlem hatası',
    description: 'NVRAM fault on action', descriptionTr: 'Siemens SINAMICS G120, F03000 koduyla “NVRAM işlem hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F03001', title: 'NVRAM checksum incorrect', titleTr: 'NVRAM checksum hatası',
    description: 'NVRAM checksum incorrect', descriptionTr: 'Siemens SINAMICS G120, F03001 koduyla “NVRAM checksum hatası” durumunu bildiriyor.',
    recommendedChecks: ['Hata tamponunu ve ilgili Siemens fault value bilgisini değerlendirin.', 'Firmware, hafıza kartı ve proje/parametre uyumluluğunu Siemens dokümantasyonuna göre kontrol edin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F06310', title: 'Supply voltage (p0210) incorrectly parameterized', titleTr: 'Besleme gerilimi p0210 yanlış parametrelenmiş',
    description: 'Supply voltage (p0210) incorrectly parameterized', descriptionTr: 'Siemens SINAMICS G120, F06310 koduyla “Besleme gerilimi p0210 yanlış parametrelenmiş” durumunu bildiriyor.',
    recommendedChecks: ['p0210 parametresindeki besleme gerilimi değerini gerçek şebeke gerilimiyle karşılaştırın.', 'Giriş beslemesini ve DC bara gerilimini yetkili elektrik personeliyle doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F06922', title: 'Braking resistor phase failure', titleTr: 'Frenleme direnci faz kaybı',
    description: 'Braking resistor phase failure', descriptionTr: 'Siemens SINAMICS G120, F06922 koduyla “Frenleme direnci faz kaybı” durumunu bildiriyor.',
    recommendedChecks: ['Frenleme direnci bağlantılarını ve faz sürekliliğini enerji güvenli şekilde izole edildikten sonra kontrol edin.', 'Frenleme devresini üretici dokümantasyonuna göre yetkili personelle değerlendirin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07016', title: 'Drive: Motor temperature sensor fault', titleTr: 'Motor sıcaklık sensörü hatası',
    description: 'Drive: Motor temperature sensor fault', descriptionTr: 'Siemens SINAMICS G120, F07016 koduyla “Motor sıcaklık sensörü hatası” durumunu bildiriyor.',
    recommendedChecks: ['Motor sıcaklık sensörü, kablosu ve sensör tipini kontrol edin.', 'Motor sıcaklık izleme parametrelerini Siemens dokümantasyonuna göre doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07080', title: 'Drive: Incorrect control parameter', titleTr: 'Kontrol parametresi hatalı',
    description: 'Drive: Incorrect control parameter', descriptionTr: 'Siemens SINAMICS G120, F07080 koduyla “Kontrol parametresi hatalı” durumunu bildiriyor.',
    recommendedChecks: ['İlgili kontrol/makro parametrelerini ve devreye alma verilerini Siemens dokümantasyonuna göre doğrulayın.', 'Değişiklik yapmadan önce mevcut parametre setini yedekleyin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07082', title: 'Macro: Execution not possible', titleTr: 'Makro çalıştırılamıyor',
    description: 'Macro: Execution not possible', descriptionTr: 'Siemens SINAMICS G120, F07082 koduyla “Makro çalıştırılamıyor” durumunu bildiriyor.',
    recommendedChecks: ['İlgili kontrol/makro parametrelerini ve devreye alma verilerini Siemens dokümantasyonuna göre doğrulayın.', 'Değişiklik yapmadan önce mevcut parametre setini yedekleyin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07083', title: 'Macro: ACX file not found', titleTr: 'Makro ACX dosyası bulunamadı',
    description: 'Macro: ACX file not found', descriptionTr: 'Siemens SINAMICS G120, F07083 koduyla “Makro ACX dosyası bulunamadı” durumunu bildiriyor.',
    recommendedChecks: ['İlgili kontrol/makro parametrelerini ve devreye alma verilerini Siemens dokümantasyonuna göre doğrulayın.', 'Değişiklik yapmadan önce mevcut parametre setini yedekleyin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07084', title: 'Macro: Condition for WaitUntil not fulfilled', titleTr: 'Makro WaitUntil koşulu sağlanmadı',
    description: 'Macro: Condition for WaitUntil not fulfilled', descriptionTr: 'Siemens SINAMICS G120, F07084 koduyla “Makro WaitUntil koşulu sağlanmadı” durumunu bildiriyor.',
    recommendedChecks: ['İlgili kontrol/makro parametrelerini ve devreye alma verilerini Siemens dokümantasyonuna göre doğrulayın.', 'Değişiklik yapmadan önce mevcut parametre setini yedekleyin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07086', title: 'Units changeover: Parameter limit violation due to reference value change', titleTr: 'Birim dönüşümü: referans değişimi nedeniyle parametre limiti ihlali',
    description: 'Units changeover: Parameter limit violation due to reference value change', descriptionTr: 'Siemens SINAMICS G120, F07086 koduyla “Birim dönüşümü: referans değişimi nedeniyle parametre limiti ihlali” durumunu bildiriyor.',
    recommendedChecks: ['İlgili kontrol/makro parametrelerini ve devreye alma verilerini Siemens dokümantasyonuna göre doğrulayın.', 'Değişiklik yapmadan önce mevcut parametre setini yedekleyin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07088', title: 'Units changeover: Parameter limit violation due to units changeover', titleTr: 'Birim dönüşümü nedeniyle parametre limiti ihlali',
    description: 'Units changeover: Parameter limit violation due to units changeover', descriptionTr: 'Siemens SINAMICS G120, F07088 koduyla “Birim dönüşümü nedeniyle parametre limiti ihlali” durumunu bildiriyor.',
    recommendedChecks: ['İlgili kontrol/makro parametrelerini ve devreye alma verilerini Siemens dokümantasyonuna göre doğrulayın.', 'Değişiklik yapmadan önce mevcut parametre setini yedekleyin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07220', title: 'Drive: Master control by PLC missing', titleTr: 'PLC ana kontrol sinyali eksik',
    description: 'Drive: Master control by PLC missing', descriptionTr: 'Siemens SINAMICS G120, F07220 koduyla “PLC ana kontrol sinyali eksik” durumunu bildiriyor.',
    recommendedChecks: ['PLC/fieldbus bağlantısını, telegram durumunu ve ana kontrol sinyalini kontrol edin.', 'Kablo, cihaz adı/adres ve haberleşme yapılandırmasını proje dokümantasyonuna göre doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07300', title: 'Drive: Line contactor feedback signal missing', titleTr: 'Hat kontaktörü geri bildirim sinyali eksik',
    description: 'Drive: Line contactor feedback signal missing', descriptionTr: 'Siemens SINAMICS G120, F07300 koduyla “Hat kontaktörü geri bildirim sinyali eksik” durumunu bildiriyor.',
    recommendedChecks: ['Hat kontaktörü geri bildirim devresini ve izleme süresini yetkili personelle kontrol edin.', 'Kontaktörün fiziksel durumunu ve kumanda/geri bildirim sinyallerini enerji güvenli şekilde izole ederek doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07330', title: 'Flying restart: Measured search current too low', titleTr: 'Flying restart arama akımı çok düşük',
    description: 'Flying restart: Measured search current too low', descriptionTr: 'Siemens SINAMICS G120, F07330 koduyla “Flying restart arama akımı çok düşük” durumunu bildiriyor.',
    recommendedChecks: ['Flying restart / otomatik yeniden başlatma koşullarını ve ilgili parametreleri kontrol edin.', 'Motor ve prosesin bu fonksiyon için uygunluğunu üretici dokümantasyonuna göre değerlendirin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07331', title: 'Flying restart: Function not supported', titleTr: 'Flying restart fonksiyonu desteklenmiyor',
    description: 'Flying restart: Function not supported', descriptionTr: 'Siemens SINAMICS G120, F07331 koduyla “Flying restart fonksiyonu desteklenmiyor” durumunu bildiriyor.',
    recommendedChecks: ['Flying restart / otomatik yeniden başlatma koşullarını ve ilgili parametreleri kontrol edin.', 'Motor ve prosesin bu fonksiyon için uygunluğunu üretici dokümantasyonuna göre değerlendirin.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07404', title: 'Drive: DC link voltage monitoring Vdc_Max', titleTr: 'DC bara maksimum gerilim izleme hatası',
    description: 'Drive: DC link voltage monitoring Vdc_Max', descriptionTr: 'Siemens SINAMICS G120, F07404 koduyla “DC bara maksimum gerilim izleme hatası” durumunu bildiriyor.',
    recommendedChecks: ['DC bara, hız ve akım limitleri ile ilgili gerçek değerleri izleyin.', 'Motor bağlantısı, yük ve kontrol parametrelerini Siemens dokümantasyonuna göre doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07405', title: 'Drive: Kinetic buffering minimum speed not reached', titleTr: 'Kinetik buffer minimum hıza ulaşamadı',
    description: 'Drive: Kinetic buffering minimum speed not reached', descriptionTr: 'Siemens SINAMICS G120, F07405 koduyla “Kinetik buffer minimum hıza ulaşamadı” durumunu bildiriyor.',
    recommendedChecks: ['DC bara, hız ve akım limitleri ile ilgili gerçek değerleri izleyin.', 'Motor bağlantısı, yük ve kontrol parametrelerini Siemens dokümantasyonuna göre doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07406', title: 'Drive: Kinetic buffering maximum time exceeded', titleTr: 'Kinetik buffer maksimum süre aşıldı',
    description: 'Drive: Kinetic buffering maximum time exceeded', descriptionTr: 'Siemens SINAMICS G120, F07406 koduyla “Kinetik buffer maksimum süre aşıldı” durumunu bildiriyor.',
    recommendedChecks: ['DC bara, hız ve akım limitleri ile ilgili gerçek değerleri izleyin.', 'Motor bağlantısı, yük ve kontrol parametrelerini Siemens dokümantasyonuna göre doğrulayın.'], ...source,
  },
  {
    manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07410', title: 'Drive: Current controller output limited', titleTr: 'Akım kontrolörü çıkışı limitte',
    description: 'Drive: Current controller output limited', descriptionTr: 'Siemens SINAMICS G120, F07410 koduyla “Akım kontrolörü çıkışı limitte” durumunu bildiriyor.',
    recommendedChecks: ['DC bara, hız ve akım limitleri ile ilgili gerçek değerleri izleyin.', 'Motor bağlantısı, yük ve kontrol parametrelerini Siemens dokümantasyonuna göre doğrulayın.'], ...source,
  },
]

export const G120_EXTENDED_FAULT_COUNT = g120ExtendedFaultCodes.length
