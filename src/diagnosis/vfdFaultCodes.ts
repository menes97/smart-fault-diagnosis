export type VfdManufacturer = 'siemens' | 'yaskawa' | 'danfoss'
export type VfdModelFamily = 'SINAMICS G120' | 'V1000' | 'VLT AutomationDrive FC 302'

export interface RelatedParameter {
  code: string
  nameTr: string
  purposeTr: string
}

export interface ManufacturerFaultCode {
  manufacturer: string
  modelFamily: VfdModelFamily
  code: string
  title: string
  titleTr: string
  description: string
  descriptionTr: string
  recommendedChecks: string[]
  sourceName: string
  sourceUrl: string
  sourceDocument?: string
  sourceScope?: string
  sourceSection?: string
  relatedParameters?: RelatedParameter[]
  safetyNoteTr?: string
}

const siemensSource = {
  sourceName: 'Siemens SINAMICS G120 Operating Instructions',
  sourceUrl: 'https://sid.siemens.com/v/u/A6V10556727',
  sourceDocument: 'SINAMICS G120 List Manual / Operating Instructions',
  sourceScope: 'CU240B-2 / CU240E-2',
  sourceSection: 'Faults and alarms',
}

const siemensBatchTwoSource = {
  sourceName: 'Siemens SINAMICS G120 Operating Instructions',
  sourceUrl: 'https://sid.siemens.com/v/u/A6V10556727',
  sourceDocument: 'SINAMICS G120 Operating Instructions / Compact Operating Instructions',
  sourceScope: 'Applicable G120 variants as documented by Siemens',
  sourceSection: 'Faults and alarms',
}

const siemensSafetySource = {
  sourceName: 'Siemens SINAMICS G120 Operating Instructions',
  sourceUrl: 'https://sid.siemens.com/v/u/A6V10556727',
  sourceDocument: 'SINAMICS G120 Operating Instructions / Compact Operating Instructions',
  sourceScope: 'Applicability depends on G120 variant, firmware and configured Safety Integrated functions',
  sourceSection: 'Faults and alarms',
}

const yaskawaSource = {
  sourceName: 'Yaskawa V1000 Technical Manual',
  sourceUrl: 'https://www.yaskawa.com/delegate/getAttachment?cmd=documents&documentId=SIEPC71060618&documentName=SIEPC71060618.pdf',
}

const danfossSource = {
  sourceName: 'Danfoss VLT AutomationDrive FC 302 documentation',
  sourceUrl: 'https://www.danfoss.com/en-gb/products/dds/low-voltage-drives/vlt-drives/vlt-automationdrive-fc-301-fc-302/',
}

const turkishDescriptions: Record<string, string> = {
  'SINAMICS G120:F30002': 'Sürücü, DC bara geriliminin çalışma koşulu için yüksek olduğunu bildiriyor.',
  'SINAMICS G120:F30003': 'Sürücü, DC bara geriliminin beklenen çalışma koşulunun altında olduğunu bildiriyor.',
  'SINAMICS G120:F07807': 'Sürücü çıkışında olası kısa devre veya toprak hatası bildiriliyor.',
  'SINAMICS G120:F07900': 'Sürücü, motorun beklenen şekilde dönemediğini bildiriyor.',
  'SINAMICS G120:F07902': 'Sürücü, motor stall durumunu bildiriyor.',
  'SINAMICS G120:F08501': 'Beklenen set değeri sinyali zamanında alınmadı.',
  'SINAMICS G120:F08502': 'İzlenen haberleşme yaşam sinyali zaman aşımına uğradı.',
  'SINAMICS G120:F01910': 'Fieldbus arayüzü set değeri zaman aşımı bildiriliyor.',
  'SINAMICS G120:F03505': 'Analog giriş kablo kopukluğu bildiriliyor.',
  'SINAMICS G120:F07011': 'Motor aşırı sıcaklığı bildiriliyor.',
  'SINAMICS G120:F07320': 'Otomatik yeniden başlatma işlemi kesildi.',
  'SINAMICS G120:F07801': 'Motor aşırı akımı bildiriliyor.',
  'SINAMICS G120:F07802': 'Besleme veya güç ünitesinin hazır olmadığı bildiriliyor.',
  'SINAMICS G120:F07901': 'Motor aşırı hız bildiriliyor.',
  'SINAMICS G120:F07950': 'Motor parametrelerinde hata bildiriliyor.',
  'SINAMICS G120:F07990': 'Motor veri tanımlama işleminin hatalı olduğu bildiriliyor.',
  'SINAMICS G120:F30001': 'Güç ünitesi aşırı akımı bildiriyor.',
  'SINAMICS G120:F30004': 'Güç ünitesi soğutucu aşırı sıcaklığı bildiriyor.',
  'SINAMICS G120:F30005': 'Güç ünitesi I²t aşırı yükü bildiriyor.',
  'SINAMICS G120:F30011': 'Ana devrede besleme fazı kaybı bildiriliyor.',
  'SINAMICS G120:F30021': 'Güç ünitesi toprak hatası bildiriyor.',
  'SINAMICS G120:F01018': 'Sürücü açılışı birden fazla kez başarısız oldu.',
  'SINAMICS G120:F01122': 'Probe giriş frekansının çok yüksek olduğu bildiriliyor.',
  'SINAMICS G120:F30015': 'Motor kablosunda faz kaybı bildiriliyor.',
  'SINAMICS G120:F30022': 'Power Module güç anahtarı izleme hatası bildiriliyor.',
  'SINAMICS G120:F30027': 'DC bara ön şarj zaman aşımı bildiriliyor.',
  'SINAMICS G120:F30035': 'Giriş havası aşırı sıcaklığı bildiriliyor.',
  'SINAMICS G120:F30036': 'Güç ünitesi iç bölge aşırı sıcaklığı bildiriliyor.',
  'SINAMICS G120:F30037': 'Doğrultucu aşırı sıcaklığı bildiriliyor.',
  'SINAMICS G120:F30052': 'Power Module verilerinin hatalı olduğu bildiriliyor.',
  'SINAMICS G120:F30053': 'Power Module FPGA veri hatası bildiriliyor.',
  'SINAMICS G120:F30059': 'Dahili fan arızası bildiriliyor.',
  'SINAMICS G120:F30074': 'Control Unit ile Power Module arasında haberleşme hatası bildiriliyor.',
  'SINAMICS G120:F01600': 'Safety Integrated güvenlik durdurması veya giriş uyuşmazlığı bildiriliyor.',
  'V1000:Uv1': 'Sürücü DC bara düşük gerilimi bildiriyor.',
  'V1000:GF': 'Sürücü motor tarafında toprak hatası bildiriyor.',
  'V1000:oC': 'Sürücü aşırı akım bildiriyor.',
  'V1000:ov': 'Sürücü DC bara aşırı gerilimi bildiriyor.',
  'V1000:oH1': 'Sürücü soğutucu aşırı sıcaklığı bildiriyor.',
  'V1000:oL1': 'Sürücü motor aşırı yükü bildiriyor.',
  'V1000:oL2': 'Sürücü aşırı yükü bildiriyor.',
  'V1000:PF': 'Sürücü giriş faz kaybı bildiriyor.',
  'V1000:LF': 'Sürücü çıkış faz kaybı bildiriyor.',
  'VLT AutomationDrive FC 302:4': 'Sürücü şebeke faz kaybı bildiriyor.',
  'VLT AutomationDrive FC 302:5': 'Sürücü DC bara geriliminin yüksek olduğunu bildiriyor.',
  'VLT AutomationDrive FC 302:6': 'Sürücü DC bara geriliminin düşük olduğunu bildiriyor.',
  'VLT AutomationDrive FC 302:7': 'Sürücü DC aşırı gerilim bildiriyor.',
  'VLT AutomationDrive FC 302:8': 'Sürücü DC düşük gerilim bildiriyor.',
  'VLT AutomationDrive FC 302:9': 'Sürücü inverter aşırı yükü bildiriyor.',
  'VLT AutomationDrive FC 302:13': 'Sürücü aşırı akım bildiriyor.',
}

const rawManufacturerFaultCodes: Array<Omit<ManufacturerFaultCode, 'descriptionTr'>> = [
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30002', title: 'Power unit: DC link voltage overvoltage', titleTr: 'DC bara aşırı gerilimi', description: 'DC link voltage is reported above the permitted operating condition.', recommendedChecks: ['Besleme gerilimini değerlendirin.', 'Yavaşlama sırasında rejeneratif enerji koşullarını değerlendirin.', 'Varsa frenleme sistemini üretici dokümantasyonuna göre kontrol edin.'], relatedParameters: [{ code: 'p1121', nameTr: 'Yavaşlama rampası süresi', purposeTr: 'Rejeneratif enerji nedeniyle DC bara gerilimi yükseliyorsa yavaşlama süresini değerlendirmek için.' }, { code: 'p1130', nameTr: 'Rampa yuvarlama süresi başlangıcı', purposeTr: 'Hız rampasının geçişlerini yumuşatmak için.' }, { code: 'p1136', nameTr: 'Rampa yuvarlama süresi sonu', purposeTr: 'Yavaşlama rampasındaki dinamik geçişleri yumuşatmak için.' }, { code: 'p1240', nameTr: 'Vdc kontrol yapılandırması - vektör kontrol', purposeTr: 'DC bara maksimum gerilim kontrolünün vektör kontrolde etkinliğini değerlendirmek için.' }, { code: 'p1280', nameTr: 'Vdc kontrol yapılandırması - U/f', purposeTr: 'DC bara maksimum gerilim kontrolünün U/f kontrolde etkinliğini değerlendirmek için.' }, { code: 'p0210', nameTr: 'Sürücü giriş besleme gerilimi', purposeTr: 'Sürücünün beklediği şebeke gerilimi ayarını kontrol etmek için.' }], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30003', title: 'Power unit: DC link voltage undervoltage', titleTr: 'DC bara düşük gerilimi', description: 'DC link voltage is reported below the expected operating condition.', recommendedChecks: ['Giriş besleme gerilimini ve bağlantıları kontrol edin.', 'DC bara gerilimini doğrulayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07807', title: 'Drive: Short-circuit / ground fault detected', titleTr: 'Kısa devre / toprak hatası algılandı', description: 'Drive reports a possible output short-circuit or ground fault.', recommendedChecks: ['Enerji izolasyonu sonrası motor ve kablo devresini yetkili personelle inceleyin.', 'İzolasyon ve topraklama kontrollerini üretici prosedürlerine göre planlayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07900', title: 'Drive: Motor blocked', titleTr: 'Motor bloke', description: 'Drive reports that the motor cannot rotate as expected.', recommendedChecks: ['Motorun ve tahrik edilen mekanizmanın serbest hareketini kontrol edin.', 'Yük koşullarını ve tork limitlerini değerlendirin.'], relatedParameters: [{ code: 'p2175', nameTr: 'Motor bloke hız eşiği', purposeTr: 'Motor bloke algılamasında kullanılan hız eşiği.' }, { code: 'p2177', nameTr: 'Motor bloke gecikme süresi', purposeTr: 'Motor bloke durumunun hata olarak değerlendirilmeden önceki gecikme süresi.' }, { code: 'r1538', nameTr: 'Pozitif yönde etkin tork limiti', purposeTr: 'Pozitif dönüş yönündeki mevcut tork limitini izlemek için.' }, { code: 'r1539', nameTr: 'Negatif yönde etkin tork limiti', purposeTr: 'Negatif dönüş yönündeki mevcut tork limitini izlemek için.' }], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07902', title: 'Drive: Motor stalled', titleTr: 'Motor stall / motor hareketini sürdüremiyor', description: 'Drive reports a motor stall condition.', recommendedChecks: ['Motor etiket verileri ve sürücü motor parametrelerini doğrulayın.', 'Akım limitlerini ve motor bağlantılarını kontrol edin.'], relatedParameters: [{ code: 'p2178', nameTr: 'Motor stall gecikme süresi', purposeTr: 'Stall algılamasının hata üretmeden önceki gecikme süresi.' }, { code: 'p1745', nameTr: 'Motor modeli stall algılama hata eşiği', purposeTr: 'Düşük hız bölgesinde motor stall algılamasında kullanılan eşik.' }, { code: 'p0640', nameTr: 'Akım limiti', purposeTr: 'Sürücünün motor için kullandığı akım limitini kontrol etmek için.' }, { code: 'r0067', nameTr: 'Etkin çıkış akım limiti', purposeTr: 'Mevcut etkin akım limitini izlemek için.' }, { code: 'r0289', nameTr: 'Güç ünitesi maksimum çıkış akımı', purposeTr: 'Güç ünitesinin mevcut akım sınırını değerlendirmek için.' }], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F08501', title: 'PROFINET: Setpoint timeout', titleTr: 'PROFINET set değeri zaman aşımı', description: 'The expected PROFINET setpoint signal was not received in time.', recommendedChecks: ['PROFINET bağlantısını ve kabloları kontrol edin.', 'PLC ile sürücü arasındaki telegram durumunu değerlendirin.', 'IP/device name ve iletişim yapılandırmasını kontrol edin.'], relatedParameters: [{ code: 'p2044', nameTr: 'Haberleşme hata gecikme süresi', purposeTr: 'PROFINET set değeri zaman aşımının izleme/gecikme süresini kontrol etmek için.' }], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F08502', title: 'Monitoring time / sign-of-life expired', titleTr: 'Haberleşme yaşam sinyali zaman aşımı', description: 'The monitored communication sign-of-life signal expired.', recommendedChecks: ['Haberleşme hattı, terminasyon ve kontrolör durumunu inceleyin.', 'İletişim izleme ayarlarını üretici dokümantasyonuna göre doğrulayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01910', title: 'Fieldbus interface setpoint timeout', titleTr: 'Fieldbus arayüzü set değeri zaman aşımı', description: 'The fieldbus interface setpoint was not received within the monitoring time.', recommendedChecks: ['Fieldbus bağlantısını kontrol edin.', 'PLC/sürücü telegram ve haberleşme durumunu değerlendirin.', 'İletişim zaman aşımı parametrelerini üretici dokümantasyonuna göre kontrol edin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F03505', title: 'Analog input wire breakage', titleTr: 'Analog giriş kablo kopukluğu', description: 'The drive reports a wire breakage on an analog input.', recommendedChecks: ['Analog giriş sinyal kaynağı ve kablosunu kontrol edin.', '4–20 mA / 2–10 V sinyal seviyesini doğrulayın.', 'Analog giriş tipinin doğru yapılandırıldığını kontrol edin.'], relatedParameters: [{ code: 'p0756', nameTr: 'Analog giriş tipi', purposeTr: 'Analog girişin voltaj/akım tipini ve kopukluk izleme modunu kontrol etmek için.' }, { code: 'p0761', nameTr: 'Analog giriş kablo kopukluğu eşik değeri', purposeTr: 'Kablo kopukluğu izleme eşik seviyesini değerlendirmek için.' }, { code: 'r0752', nameTr: 'Analog giriş gerçek değeri', purposeTr: 'Analog girişte ölçülen mevcut sinyal değerini izlemek için.' }], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07011', title: 'Drive: Motor overtemperature', titleTr: 'Motor aşırı sıcaklığı', description: 'The drive reports motor overtemperature.', recommendedChecks: ['Motor soğutmasını, yükü ve ortam koşullarını değerlendirin.', 'Motor sıcaklık geri bildirimi ve parametrelerini yetkili personelle doğrulayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07320', title: 'Drive: Automatic restart interrupted', titleTr: 'Otomatik yeniden başlatma kesildi', description: 'The automatic restart sequence was interrupted.', recommendedChecks: ['Aktif arıza ve izin koşullarını yetkili personelle inceleyin.', 'Otomatik yeniden başlatma parametrelerini tesis prosedürlerine göre doğrulayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07801', title: 'Drive: Motor overcurrent', titleTr: 'Motor aşırı akımı', description: 'The drive reports motor overcurrent.', recommendedChecks: ['Motor yükü, kablo ve hızlanma koşullarını değerlendirin.', 'Akım limiti ile motor parametrelerini yetkili personelle doğrulayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07802', title: 'Drive: Infeed or power unit not ready', titleTr: 'Besleme veya güç ünitesi hazır değil', description: 'The drive reports that the infeed or power unit is not ready.', recommendedChecks: ['Besleme ve güç ünitesi durumunu yetkili elektrik personeliyle kontrol edin.', 'İzin, interlock ve güç bağlantılarını tesis prosedürlerine göre değerlendirin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07901', title: 'Drive: Motor overspeed', titleTr: 'Motor aşırı hız', description: 'The drive reports motor overspeed.', recommendedChecks: ['Hız referansı ve hız limitlerini yetkili personelle doğrulayın.', 'Geri besleme ve mekanik yük koşullarını değerlendirin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07950', title: 'Motor parameter incorrect', titleTr: 'Motor parametreleri hatalı', description: 'The drive reports incorrect motor parameters.', recommendedChecks: ['Motor etiket verileri ile sürücü motor parametrelerini karşılaştırın.', 'Yetkili personelle motor bağlantısı ve devreye alma verilerini doğrulayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F07990', title: 'Incorrect motor data identification', titleTr: 'Motor veri tanımlama işlemi hatalı', description: 'The motor data identification procedure was not completed correctly.', recommendedChecks: ['Motor veri tanımlama koşullarını üretici dokümantasyonuna göre gözden geçirin.', 'Motor parametreleri ve bağlantılarını yetkili personelle doğrulayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30001', title: 'Power unit: Overcurrent', titleTr: 'Güç ünitesi aşırı akımı', description: 'The power unit reports overcurrent.', recommendedChecks: ['Motor, kablo ve mekanik yük koşullarını yetkili personelle inceleyin.', 'Güç ünitesi ve motor parametrelerini karşılaştırın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30004', title: 'Power unit: Heat sink overtemperature', titleTr: 'Güç ünitesi soğutucu aşırı sıcaklığı', description: 'The power unit reports heat sink overtemperature.', recommendedChecks: ['Soğutma havasını, fanları ve ortam sıcaklığını kontrol edin.', 'Soğutucu yüzeyindeki hava akışının engellenmediğini doğrulayın.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30005', title: 'Power unit: Overload I2t', titleTr: 'Güç ünitesi I²t aşırı yükü', description: 'The power unit reports an I2t overload condition.', recommendedChecks: ['Yük profilini ve çalışma çevrimini değerlendirin.', 'Sürücü boyutlandırmasını ve akım limitlerini yetkili personelle gözden geçirin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30011', title: 'Power unit: Line phase failure in main circuit', titleTr: 'Ana devrede besleme fazı kaybı', description: 'The power unit reports line phase failure in the main circuit.', recommendedChecks: ['Üç faz giriş beslemesini kontrol edin.', 'Sigorta, kontaktör ve güç bağlantılarını yetkili personelle değerlendirin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30021', title: 'Power unit: Ground fault', titleTr: 'Güç ünitesi toprak hatası', description: 'The power unit reports a ground fault.', recommendedChecks: ['Motor kablosu ve motor izolasyonunun yetkili personel tarafından uygun test yöntemleriyle değerlendirilmesini sağlayın.', 'Enerji izolasyonu altında kablo ve bağlantıları inceleyin.'], ...siemensSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01018', title: 'Power-up aborted more than once', titleTr: 'Sürücü açılışı birden fazla kez başarısız oldu', description: 'Drive power-up was aborted more than once.', recommendedChecks: ['Sürücüyü güvenli şekilde yeniden enerjilendirmeden önce hata geçmişini değerlendirin.', 'Parametre ve commissioning durumunu kontrol edin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01122', title: 'Frequency at the probe input too high', titleTr: 'Probe giriş frekansı çok yüksek', description: 'The frequency at the probe input is too high.', recommendedChecks: ['Probe girişine gelen darbe frekansını kontrol edin.', 'Sensör veya enkoder sinyal koşullarını değerlendirin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30015', title: 'Motor cable phase failure', titleTr: 'Motor kablosunda faz kaybı', description: 'A motor cable phase failure is reported.', recommendedChecks: ['Motor kablosu ve terminal bağlantılarını kontrol edin.', 'Faz sürekliliğini yetkili personel tarafından doğrulayın.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30022', title: 'Power Module: Monitoring VCE/UCE', titleTr: 'Power Module güç anahtarı izleme hatası', description: 'The Power Module reports a VCE/UCE monitoring fault.', recommendedChecks: ['Power Module durumunu ve bağlantılarını değerlendirin.', 'Tekrarlayan durumda üretici servisine yönlendirin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30027', title: 'Time monitoring for DC link pre-charging', titleTr: 'DC bara ön şarj zaman aşımı', description: 'DC link pre-charging did not complete within the monitored time.', recommendedChecks: ['Giriş besleme gerilimini kontrol edin.', 'Faz beslemelerini ve ana kontaktör koşullarını değerlendirin.', 'DC bara ön şarj devresiyle ilgili üretici kontrollerini inceleyin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30035', title: 'Overtemperature, intake air', titleTr: 'Giriş havası aşırı sıcaklığı', description: 'The intake air temperature is too high.', recommendedChecks: ['Fan çalışmasını kontrol edin.', 'Hava akışını ve filtreleri kontrol edin.', 'Ortam sıcaklığını değerlendirin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30036', title: 'Overtemperature, inside area', titleTr: 'Güç ünitesi iç bölge aşırı sıcaklığı', description: 'The internal power unit area temperature is too high.', recommendedChecks: ['Fan çalışmasını kontrol edin.', 'Hava akışını ve filtreleri kontrol edin.', 'Ortam sıcaklığını değerlendirin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30037', title: 'Rectifier overtemperature', titleTr: 'Doğrultucu aşırı sıcaklığı', description: 'The rectifier temperature is too high.', recommendedChecks: ['Fan çalışmasını kontrol edin.', 'Hava akışını ve filtreleri kontrol edin.', 'Ortam sıcaklığını değerlendirin.', 'Motor yükünü ve giriş fazlarını kontrol edin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30052', title: 'Incorrect Power Module data', titleTr: 'Power Module verileri hatalı', description: 'The Power Module data is reported as incorrect.', recommendedChecks: ['Firmware / Power Module uyumluluğunu değerlendirin.', 'Gerekirse üretici teknik desteğine yönlendirin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30053', title: 'Error in FPGA data', titleTr: 'Power Module FPGA veri hatası', description: 'An error in Power Module FPGA data is reported.', recommendedChecks: ['Firmware / Power Module uyumluluğunu değerlendirin.', 'Gerekirse üretici teknik desteğine yönlendirin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30059', title: 'Internal fan defective', titleTr: 'Dahili fan arızası', description: 'The internal fan is reported as defective.', recommendedChecks: ['Dahili fan durumunu kontrol edin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F30074', title: 'Communications fault between Control Unit and Power Module', titleTr: 'Control Unit ile Power Module arasında haberleşme hatası', description: 'A communication fault between the Control Unit and Power Module is reported.', recommendedChecks: ['Control Unit ve Power Module bağlantısını kontrol edin.', '24 V kontrol beslemesinin kararlılığını değerlendirin.'], ...siemensBatchTwoSource },
  { manufacturer: 'Siemens', modelFamily: 'SINAMICS G120', code: 'F01600', title: 'Safety Integrated: STOP A initiated / safety discrepancy', titleTr: 'Safety Integrated güvenlik durdurması / giriş uyuşmazlığı', description: 'A Safety Integrated stop or input discrepancy is reported. The exact fault value and configured safety function must be checked.', recommendedChecks: ['Aktif safety fonksiyonunu ve ilgili fault value bilgisini kontrol edin.', 'STO / failsafe giriş durumlarını yetkili personelle değerlendirin.', 'PROFIsafe veya güvenlik girişlerinde uyuşmazlık olup olmadığını kontrol edin.'], safetyNoteTr: 'STO veya herhangi bir safety fonksiyonunu baypas etmeyin, devre dışı bırakmayın veya etkisizleştirmeyin.', ...siemensSafetySource },

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

export const manufacturerFaultCodes: ManufacturerFaultCode[] = rawManufacturerFaultCodes.map((entry) => ({
  ...entry,
  descriptionTr: turkishDescriptions[`${entry.modelFamily}:${entry.code}`],
}))

export function normalizeFaultCode(value: string): string {
  return value.trim().replaceAll(' ', '').toUpperCase()
}

export function normalizeFaultCodeForModel(
  manufacturer: VfdManufacturer | '',
  modelFamily: VfdModelFamily | '',
  rawCode: string,
): string {
  const normalized = normalizeFaultCode(rawCode)
  if (manufacturer !== 'siemens' || modelFamily !== 'SINAMICS G120') return normalized

  const numericPart = normalized.match(/^F?(\d+)$/)?.[1]
  if (!numericPart || (numericPart.length !== 4 && numericPart.length !== 5)) {
    return normalized
  }

  return `F${numericPart.padStart(5, '0')}`
}

export function lookupManufacturerFaultCode(
  manufacturer: VfdManufacturer | '',
  modelFamily: VfdModelFamily | '',
  rawCode: string,
): ManufacturerFaultCode | undefined {
  const normalizedInput = normalizeFaultCodeForModel(manufacturer, modelFamily, rawCode)
  return manufacturerFaultCodes.find(
    (entry) =>
      entry.manufacturer.toLocaleLowerCase('tr-TR') === manufacturer &&
      entry.modelFamily === modelFamily &&
      normalizeFaultCode(entry.code) === normalizedInput,
  )
}
