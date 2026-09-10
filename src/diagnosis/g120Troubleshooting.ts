import type { FaultTroubleshooting } from './vfdFaultCodes'

export const g120FaultTroubleshootingByCode: Record<string, FaultTroubleshooting> = {
  F07900: {
    probableCausesTr: ['Tahrik edilen mekanizma mekanik olarak sıkışmış veya serbest hareket etmiyor olabilir.', 'Yük talebi mevcut tork kapasitesini aşabilir.', 'Motor beklenen şekilde hızlanamıyor olabilir.', 'Motor bloke izleme koşulları ve limitleri doğrulama gerektirebilir.'],
    steps: [
      { order: 1, titleTr: 'Arıza ve çalışma koşulunu doğrulayın', detailTr: 'Hata kodunu, oluştuğu hız referansını ve yük durumunu kaydedin.' },
      { order: 2, titleTr: 'Mekanik serbest hareketi kontrol edin', detailTr: 'Mekanik incelemeden önce ekipmanı güvenli şekilde izole edin; motorun ve tahrik edilen mekanizmanın serbest hareketini yetkili personelle doğrulayın.', safetyCritical: true },
      { order: 3, titleTr: 'Yük ve hızlanma koşulunu değerlendirin', detailTr: 'Motorun yük talebini, hızlanma davranışını ve mevcut akım/tork göstergelerini değerlendirin.' },
      { order: 4, titleTr: 'Bloke izleme değerlerini gözden geçirin', detailTr: 'İzleme eşiği, gecikme süresi ve etkin tork limitlerini motor ve uygulama gereksinimlerine göre doğrulayın; limitleri otomatik olarak artırmayın.', parameterCodes: ['p2175', 'p2177', 'r1538', 'r1539'] },
    ],
    escalationTr: ['Mekanizma serbest olduğu halde hata tekrarlıyorsa motor, yük ve sürücü uygulamasının yetkili personel tarafından ileri incelemesi gerekir.'],
  },
  F07902: {
    probableCausesTr: ['Aşırı mekanik yük veya uygunsuz hızlanma koşulu.', 'Yetersiz kullanılabilir tork/akım limiti.', 'Motor etiket verileri veya motor parametreleriyle uyumsuzluk.', 'Motorun düşük hız bölgesinde yükü sürdürememesi.'],
    steps: [
      { order: 1, titleTr: 'Arıza bağlamını doğrulayın', detailTr: 'Hatanın hızlanma, düşük hız veya sabit yük sırasında oluşup oluşmadığını kaydedin.' },
      { order: 2, titleTr: 'Mekanik yükü değerlendirin', detailTr: 'Ekipmanı güvenli şekilde izole ettikten sonra mekanik yük, sürtünme ve hareket koşullarını yetkili personelle değerlendirin.', safetyCritical: true },
      { order: 3, titleTr: 'Motor verilerini gözden geçirin', detailTr: 'Motor etiket verilerinin sürücüdeki motor verileriyle uyumunu doğrulayın.' },
      { order: 4, titleTr: 'Stall ve akım sınırı bağlamını doğrulayın', detailTr: 'Stall gecikmesi, motor modeli eşiği, akım limitleri ve etkin çıkış sınırlarını uygulama gereksinimlerine göre inceleyin; p0640 değerini körlemesine artırmayın.', parameterCodes: ['p2178', 'p1745', 'p0640', 'r0067', 'r0289'] },
    ],
    escalationTr: ['Doğru motor verileri ve kabul edilebilir yük koşullarında hata tekrarlıyorsa motor ve mekanik sistem için ileri inceleme planlayın.'],
  },
  F07801: {
    probableCausesTr: ['Anormal mekanik yük veya hızlanma talebi.', 'Motor kablosu ya da motor tarafında anormallik.', 'Motor verilerinin uygulamayla uyumsuz olması.', 'Kısa devre veya toprak hatasına işaret eden ek bulgular.'],
    steps: [
      { order: 1, titleTr: 'Arıza koşulunu kaydedin', detailTr: 'Hatanın hızlanma, yavaşlama veya sabit çalışma sırasında oluştuğunu ve mevcut yük koşulunu kaydedin.' },
      { order: 2, titleTr: 'Mekanik yükü kontrol edin', detailTr: 'Enerji izolasyonu sonrasında mekanik sistemin serbest hareketini ve yük koşullarını yetkili personelle değerlendirin.', safetyCritical: true },
      { order: 3, titleTr: 'Motor ve kablo durumunu inceleyin', detailTr: 'Motor kablosu, terminal bağlantıları ve motor verilerini üretici prosedürlerine göre inceleyin.' },
      { order: 4, titleTr: 'Ek elektriksel bulguları değerlendirin', detailTr: 'Kısa devre veya toprak hatasına ilişkin başka hata/bulgu varsa ilgili güvenli inceleme prosedürünü uygulayın.' },
    ],
    escalationTr: ['Tekrarlayan aşırı akımda güç devresi, motor ve mekanik yük birlikte yetkili personel tarafından değerlendirilmelidir.'],
  },
  F07990: {
    probableCausesTr: ['Motor veri tanımlama koşulları uygun olmayabilir.', 'Motor etiket verileri veya bağlantısı uyumsuz olabilir.', 'Mekanik yük motor tanımlama sonucunu etkiliyor olabilir.'],
    steps: [
      { order: 1, titleTr: 'Tanımlama bağlamını doğrulayın', detailTr: 'Kullanılan motor tanımlama yöntemi ile hata oluştuğu çalışma koşulunu kaydedin.' },
      { order: 2, titleTr: 'Motor etiketini ve bağlantıyı doğrulayın', detailTr: 'Motor etiket verilerini ve gerçek terminal bağlantısını enerji güvenli şekilde izole edildikten sonra yetkili personelle karşılaştırın.', safetyCritical: true },
      { order: 3, titleTr: 'Mekanik koşulları değerlendirin', detailTr: 'Tanımlama sırasında bağlı yükün ve proses koşullarının uygunluğunu Siemens prosedürlerine göre değerlendirin.' },
      { order: 4, titleTr: 'Tanımlamayı yeniden planlayın', detailTr: 'Koşullar doğrulandıktan sonra yalnızca güvenli ve üretici prosedürüne uygun bir motor tanımlama planı uygulayın.' },
    ],
    escalationTr: ['Doğrulanmış etiket ve güvenli test koşullarında hata sürerse Siemens teknik desteği veya yetkili servis değerlendirmesi gerekebilir.'],
  },
  F30001: {
    probableCausesTr: ['Motor veya kablo devresinde anormallik.', 'Mekanik aşırı yük.', 'Aşırı hızlanma talebi.', 'Motor verileriyle uyumsuzluk.', 'Kısa devre veya toprak hatasına işaret eden bulgular.'],
    steps: [
      { order: 1, titleTr: 'Hata koşulunu doğrulayın', detailTr: 'Hatanın oluştuğu hız, yük ve hızlanma koşulunu kaydedin.' },
      { order: 2, titleTr: 'Mekanik yükü değerlendirin', detailTr: 'Ekipmanı güvenli şekilde izole ettikten sonra mekanik yük ve serbest hareket koşullarını yetkili personelle inceleyin.', safetyCritical: true },
      { order: 3, titleTr: 'Motor ve kablo devresini inceleyin', detailTr: 'Motor kablosu, terminaller ve motor verilerini üretici prosedürlerine uygun olarak değerlendirin.' },
      { order: 4, titleTr: 'Ek arıza bulgularını karşılaştırın', detailTr: 'Kısa devre veya toprak hatasıyla ilişkili ilave hata kayıtları varsa bunları ayrı güvenli inceleme akışıyla değerlendirin.' },
    ],
    escalationTr: ['Hata tekrar ediyorsa güç ünitesi, motor ve kablo devresi için yetkili servis/elektrik personeli incelemesi gerekir.'],
  },
  F30002: {
    probableCausesTr: ['Şebeke gerilimi koşulu.', 'Yavaşlama sırasında rejeneratif enerjinin DC barayı yükseltmesi.', 'Aşırı yavaşlama veya frenleme talebi.', 'Varsa frenleme ekipmanının uygulama koşuluyla uyumsuzluğu.', 'DC bara maksimum gerilim kontrolü yapılandırmasının doğrulama gerektirmesi.'],
    steps: [
      { order: 1, titleTr: 'Arıza bağlamını kaydedin', detailTr: 'Hatanın yavaşlama, yük bırakma veya rejeneratif çalışma sırasında oluşup oluşmadığını kaydedin.' },
      { order: 2, titleTr: 'Besleme koşulunu değerlendirin', detailTr: 'Şebeke gerilimini ve besleme koşullarını yalnızca tesis prosedürlerine uygun yetkili personelle değerlendirin.', safetyCritical: true },
      { order: 3, titleTr: 'Yavaşlama ve frenleme talebini inceleyin', detailTr: 'Rejeneratif çalışma ile yavaşlama rampasının DC bara gerilimini yükseltebileceğini dikkate alarak proses talebini değerlendirin.' },
      { order: 4, titleTr: 'İlgili yapılandırmayı doğrulayın', detailTr: 'Yavaşlama rampası, rampa yumuşatma, Vdc kontrol yapılandırması ve besleme gerilimi değerlerini uygulama gereksinimlerine göre doğrulayın; DC bara eşik değerini değiştirmeyin.', parameterCodes: ['p1121', 'p1130', 'p1136', 'p1240', 'p1280', 'p0210'] },
    ],
    escalationTr: ['Uygun besleme ve frenleme koşullarında hata tekrarlanıyorsa frenleme sistemi ve sürücü uygulaması için yetkili inceleme planlayın.'],
  },
  F30003: {
    probableCausesTr: ['Düşük veya kararsız şebeke gerilimi.', 'Eksik faz ya da besleme kesintisi.', 'Üst devrede koruma, kontaktör veya bağlantı sorunu.', 'Besleme kablolamasında anormallik.'],
    steps: [
      { order: 1, titleTr: 'Arıza zamanını doğrulayın', detailTr: 'Hatanın enerjilendirme, yük değişimi veya şebeke olayıyla ilişkisini kaydedin.' },
      { order: 2, titleTr: 'Giriş beslemesini kontrol edin', detailTr: 'Şebeke gerilimi ve faz sürekliliği ölçümlerini tesis prosedürlerine uygun yetkili elektrik personeliyle doğrulayın.', safetyCritical: true },
      { order: 3, titleTr: 'Üst devre elemanlarını değerlendirin', detailTr: 'Sigorta, koruma, kontaktör ve besleme bağlantılarının kararlılığını değerlendirin.' },
      { order: 4, titleTr: 'DC bara gözlemini inceleyin', detailTr: 'Besleme doğrulandıktan sonra DC bara gerilimi gözlemini sürücü çalışma bağlamıyla birlikte değerlendirin.' },
    ],
    escalationTr: ['Besleme koşulları doğrulandığı halde hata sürerse sürücü ve üst devre için ileri inceleme gerekir.'],
  },
  F30004: {
    probableCausesTr: ['Yetersiz hava akışı veya tıkalı havalandırma.', 'Fan arızası.', 'Yüksek ortam sıcaklığı.', 'Kirlenme veya soğutucu yüzeyinde engellenme.', 'Yük koşulunun sürücü kapasitesini zorlaması.'],
    steps: [
      { order: 1, titleTr: 'Çalışma bağlamını kaydedin', detailTr: 'Hatanın yük, ortam sıcaklığı ve çalışma süresiyle ilişkisini kaydedin.' },
      { order: 2, titleTr: 'Soğutma yolunu güvenli şekilde inceleyin', detailTr: 'Enerji güvenli şekilde izole edildikten sonra fan, filtre, hava girişi ve soğutucu yüzeyindeki hava akışını kontrol edin.', safetyCritical: true },
      { order: 3, titleTr: 'Ortam ve yük koşullarını değerlendirin', detailTr: 'Pano ortamı, kontaminasyon ve yük profilini sürücü uygulama koşullarıyla karşılaştırın.' },
    ],
    escalationTr: ['Hava akışı ve yük koşulları uygun olduğu halde hata tekrarlanıyorsa güç ünitesi için yetkili servis değerlendirmesi gerekir.'],
  },
  F30005: {
    probableCausesTr: ['Yük profilinin güç ünitesi kapasitesini aşması.', 'Uzun süreli yüksek akım veya zorlayıcı çalışma çevrimi.', 'Sürücü boyutlandırması veya soğutma koşullarının yetersiz kalması.'],
    steps: [
      { order: 1, titleTr: 'Yük profilini kaydedin', detailTr: 'Hatanın çalışma çevrimi, hızlanma ve yük süresiyle ilişkisini kaydedin.' },
      { order: 2, titleTr: 'Mekanik yükü değerlendirin', detailTr: 'Enerji izolasyonu sonrasında mekanik yük ve sürtünme koşullarını yetkili personelle değerlendirin.', safetyCritical: true },
      { order: 3, titleTr: 'Soğutma ve boyutlandırmayı gözden geçirin', detailTr: 'Soğutma koşulları ile sürücü kapasitesinin gerçek yük profiline uygunluğunu değerlendirin.' },
    ],
    escalationTr: ['Tekrarlayan I²t aşırı yükte uygulama boyutlandırması yetkili mühendislik incelemesi gerektirir.'],
  },
  F30011: {
    probableCausesTr: ['Üç faz giriş beslemesinde faz kaybı.', 'Sigorta veya üst devre koruma elemanının açması.', 'Kontaktör veya güç bağlantısında anormallik.', 'Hat gerilimlerinde dengesizlik.'],
    steps: [
      { order: 1, titleTr: 'Besleme olayını doğrulayın', detailTr: 'Hatanın giriş beslemesi, kontaktör durumu veya koruma olayıyla ilişkisini kaydedin.' },
      { order: 2, titleTr: 'Üç faz beslemeyi ölçün', detailTr: 'Hatlar arası gerilimleri, sigortaları ve koruma durumunu tesis prosedürlerine uygun yetkili elektrik personeliyle değerlendirin.', safetyCritical: true },
      { order: 3, titleTr: 'Kontaktör ve bağlantıları inceleyin', detailTr: 'Enerji izolasyonu sonrasında kontaktör, terminal ve güç bağlantılarında gevşeklik veya ısınma bulgularını inceleyin.', safetyCritical: true },
      { order: 4, titleTr: 'Ölçüm sonuçlarını karşılaştırın', detailTr: 'Ölçülen hatlar arası gerilimleri ve besleme sürekliliğini çalışma koşuluyla birlikte değerlendirin.' },
    ],
    escalationTr: ['Faz kaybı tekrarlanıyorsa üst devre beslemesi ve güç bağlantıları için yetkili elektrik incelemesi gerekir.'],
  },
  F30015: {
    probableCausesTr: ['Motor kablosunda veya terminallerde faz süreksizliği.', 'Motor terminal kutusunda gevşek ya da yanık bağlantı.', 'Çıkış fazı bağlantısında hasar.'],
    steps: [
      { order: 1, titleTr: 'Hata bağlamını doğrulayın', detailTr: 'Hatanın kablo hareketi, sıcaklık veya yük değişimiyle ilişkisini kaydedin.' },
      { order: 2, titleTr: 'Motor kablosu ve terminalleri inceleyin', detailTr: 'Ekipman güvenli şekilde izole edildikten sonra motor kablosu, sürücü çıkış terminalleri ve motor terminal kutusunu yetkili personelle inceleyin.', safetyCritical: true },
      { order: 3, titleTr: 'Faz sürekliliğini doğrulayın', detailTr: 'Çıkış fazı sürekliliğini uygun test yöntemleriyle doğrulayın. Bağlı sürücü üzerinden izolasyon testi uygulamayın.', safetyCritical: true },
      { order: 4, titleTr: 'Bağlantı bulgularını değerlendirin', detailTr: 'Gevşek, yanık veya kontamine bağlantı bulgularını üretici prosedürüne göre değerlendirin.' },
    ],
    escalationTr: ['Kablo ve terminal kontrolü sonrasında hata tekrarlanıyorsa motor ve çıkış devresi için ileri inceleme gerekir.'],
  },
  F30021: {
    safetyNoteTr: 'Toprak hatası incelemesi yüksek risklidir. İzolasyon testi uygulanacaksa sürücü ve hassas elektronik ekipmanlar üretici prosedürüne uygun şekilde devreden ayrılmadan test gerilimi uygulamayın.',
    probableCausesTr: ['Motor kablosunda veya motor izolasyonunda hasar.', 'Terminallerde nem, kirlenme veya fiziksel hasar.', 'Topraklama ile ilişkili anormal bulgular.'],
    steps: [
      { order: 1, titleTr: 'Ekipmanı güvenli şekilde izole edin', detailTr: 'Arıza incelemesine başlamadan önce enerji izolasyonunu ve tesis prosedürlerini yetkili personelle doğrulayın.', safetyCritical: true },
      { order: 2, titleTr: 'Kablo ve terminalleri inceleyin', detailTr: 'Motor kablosu, terminal kutusu ve sürücü çıkış terminallerinde kontaminasyon, hasar veya nem bulgularını inceleyin.', safetyCritical: true },
      { order: 3, titleTr: 'İzolasyon değerlendirmesini planlayın', detailTr: 'Motor kablosu ve motor izolasyonunu yalnızca uygun test yöntemi ve üretici prosedürüyle değerlendirin.', safetyCritical: true },
      { order: 4, titleTr: 'Toprak hatası bulgularını kaydedin', detailTr: 'Arızanın hangi kablo/motor koşullarında ortaya çıktığını kaydederek sonraki inceleme için kanıt oluşturun.' },
    ],
    escalationTr: ['Toprak hatası bulgusu tekrarlanıyorsa motor, kablo ve güç devresi için yetkili elektrik personeli veya Siemens servisi incelemesi gerekir.'],
  },
  F30059: {
    probableCausesTr: ['Dahili fan arızası.', 'Hava yolunda tıkanma veya kontaminasyon.', 'Yüksek ortam sıcaklığı.', 'Soğutma koşullarının yetersizliği.'],
    steps: [
      { order: 1, titleTr: 'Çalışma koşulunu kaydedin', detailTr: 'Hatanın ortam sıcaklığı, çalışma süresi ve yükle ilişkisini kaydedin.' },
      { order: 2, titleTr: 'Fan ve hava yolunu inceleyin', detailTr: 'Enerji güvenli şekilde izole edildikten sonra dahili fan durumu, filtreler ve hava akışını yetkili personelle inceleyin.', safetyCritical: true },
      { order: 3, titleTr: 'Ortam ve yükü değerlendirin', detailTr: 'Pano havalandırması, kontaminasyon ve yük profilini değerlendirin.' },
    ],
    escalationTr: ['Fan arızası doğrulanırsa iç bileşen onarımına müdahale etmeden Siemens servis veya yetkili bakım sürecine yönlendirin.'],
  },
  F30074: {
    probableCausesTr: ['Control Unit ile Power Module arasındaki bağlantı bütünlüğü sorunu.', 'Kararsız kontrol beslemesi.', 'Tekrarlayan iç CU/PM haberleşme arızası.'],
    steps: [
      { order: 1, titleTr: 'Hata tekrarını doğrulayın', detailTr: 'Hatanın enerji verme, titreşim, sıcaklık veya güç çevrimi sonrasındaki davranışını kaydedin.' },
      { order: 2, titleTr: 'CU/PM bağlantısını inceleyin', detailTr: 'Enerji güvenli şekilde izole edildikten sonra Control Unit ve Power Module oturuşunu/bağlantı bütünlüğünü yetkili personelle değerlendirin.', safetyCritical: true },
      { order: 3, titleTr: 'Kontrol beslemesini değerlendirin', detailTr: 'Kontrol beslemesinin kararlılığını tesis prosedürlerine uygun şekilde doğrulayın.' },
      { order: 4, titleTr: 'Tekrarlayan arızayı kaydedin', detailTr: 'Güvenli güç çevrimi sonrası arıza tekrarını ve hata geçmişini kaydedin; bileşen düzeyinde iç onarım yapmayın.' },
    ],
    escalationTr: ['Tekrarlayan CU/PM iç haberleşme arızaları Siemens servis veya donanım incelemesi gerektirebilir.'],
  },
  F08501: {
    probableCausesTr: ['PLC çevrimiçi durumunun kaybı.', 'PROFINET ağ/kablo sorunu.', 'Cihaz adı veya IP yapılandırması uyumsuzluğu.', 'PLC ile sürücü telegram yapılandırması uyumsuzluğu.', 'Haberleşme izleme bağlamının doğrulama gerektirmesi.'],
    steps: [
      { order: 1, titleTr: 'PLC ve hata bağlamını doğrulayın', detailTr: 'PLC çevrimiçi durumu ile hatanın zamanını ve ilgili haberleşme olaylarını kaydedin.' },
      { order: 2, titleTr: 'Ağ bağlantısını inceleyin', detailTr: 'PROFINET kablosu, ağ bileşenleri ve fiziksel bağlantıları enerji güvenliği ve tesis prosedürlerine uygun şekilde yetkili personelle değerlendirin.', safetyCritical: true },
      { order: 3, titleTr: 'Proje yapılandırmasını karşılaştırın', detailTr: 'Cihaz adı, IP yapılandırması ve PLC-sürücü telegram seçiminin engineering projesiyle uyumunu doğrulayın; PLC adresi tahmin etmeyin.' },
      { order: 4, titleTr: 'İzleme bağlamını inceleyin', detailTr: 'Haberleşme hata gecikmesi/izleme bağlamını uygulama ve üretici dokümantasyonuna göre doğrulayın.', parameterCodes: ['p2044'] },
    ],
    escalationTr: ['Ağ ve proje yapılandırması doğrulandığı halde hata sürerse otomasyon/PLC sorumlusu ile Siemens haberleşme incelemesi planlayın.'],
  },
  F03505: {
    probableCausesTr: ['Analog sinyal kaynağında kesinti.', 'Analog giriş kablosunda kopukluk veya bağlantı sorunu.', '4–20 mA ya da yapılandırılmış sinyal tipinde uyumsuzluk.', 'Analog giriş yapılandırmasının saha sinyaliyle uyumsuzluğu.'],
    steps: [
      { order: 1, titleTr: 'Sinyal ve hata bağlamını doğrulayın', detailTr: 'Hatanın hangi kontrol modunda ve hangi sinyal kaynağıyla oluştuğunu kaydedin.' },
      { order: 2, titleTr: 'Sinyal kaynağı ve kabloyu inceleyin', detailTr: 'Enerji güvenli şekilde izole edildikten sonra analog sinyal kaynağı, kablo ve terminalleri yetkili personelle inceleyin.', safetyCritical: true },
      { order: 3, titleTr: 'Sinyal tipini doğrulayın', detailTr: '4–20 mA veya yapılandırılmış diğer sinyal tipinin saha cihazı ve giriş tipiyle uyumunu doğrulayın.' },
      { order: 4, titleTr: 'Giriş yapılandırması ve gerçek değeri gözden geçirin', detailTr: 'Analog giriş tipi, kablo kopukluğu izleme eşiği ve mevcut giriş değerini uygulama gereksinimlerine göre doğrulayın.', parameterCodes: ['p0756', 'p0761', 'r0752'] },
    ],
    escalationTr: ['Sinyal kaynağı ve yapılandırması doğrulandığı halde hata sürerse saha enstrümantasyonu ve sürücü giriş devresi için ileri inceleme gerekir.'],
  },
}
