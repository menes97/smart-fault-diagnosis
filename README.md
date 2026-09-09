# Akıllı Arıza Teşhis Sistemi

Endüstriyel bakım ekipleri için geliştirilen, **kural tabanlı arıza teşhisi**, **doğrulanmış sürücü hata kodu bilgi bankası** ve **Siemens SINAMICS G120 hızlı devreye alma rehberi** sunan React tabanlı web uygulaması.

> **Canlı demo:** https://smart-fault-diagnosis.vercel.app/

## Projenin amacı

Bakım sırasında farklı kaynaklar arasında dolaşmadan;

- arıza belirtilerini ve ölçümleri tek ekranda değerlendirmek,
- olası arızaları açıklanabilir puanlarla sıralamak,
- üretici hata kodlarını doğrulanmış kaynaklarla göstermek,
- G120 devreye alma sürecini adım adım yönlendirmek,
- yapılan teşhisleri tarayıcıda geçmiş olarak saklamak

amaçlanmıştır.

Uygulama yapay zekâ ile serbest tahmin yapmak yerine mümkün olduğunca **deterministik ve açıklanabilir kurallar** kullanır.

## V1 özellikleri

### Elektrik motoru arıza teşhisi

Üç fazlı asenkron motorlar için belirtiler ve ölçümler birlikte değerlendirilir.

Desteklenen örnek teşhisler:

- Mekanik aşırı yük
- Mekanik sıkışma
- Rulman problemi
- Faz kaybı
- Faz akımı dengesizliği
- Motor sargı problemi
- Kontaktör / elektriksel bağlantı problemi
- Besleme gerilim problemi
- Yanlış yıldız / üçgen bağlantısı

Sistem, sonuçların altında **"Neden eşleşti?"** bölümünde puana katkı yapan kanıtları gösterir.

### VFD / frekans konvertörü teşhisi

Genel VFD belirtileri ve ölçümleri için kural tabanlı değerlendirme içerir.

Örnek kategoriler:

- Aşırı akım
- DC bara aşırı gerilimi
- Düşük besleme / DC bara gerilimi
- Sürücü aşırı sıcaklığı
- Motor aşırı yükü
- Haberleşme problemi
- Hız referansı problemi
- Sürücü hazır değil

DC bara değerlendirmesi 230 V, 400 V ve 480 V sürücü sınıflarına göre yapılabilir.

### Doğrulanmış üretici hata kodları

V1'de şu aileler için doğrulanmış hata kodu kayıtları bulunur:

- Siemens SINAMICS G120
- Yaskawa V1000
- Danfoss VLT AutomationDrive FC 302

Bilinen üretici kodları exact/normalize edilmiş eşleşme ile gösterilir. Bilinmeyen kodlar için uygulama anlam **uydurmaz**.

Siemens G120 kayıtlarında ayrıca uygun olan hatalar için:

- ilgili parametreler,
- Türkçe açıklamalar,
- önerilen güvenli kontroller,
- resmi Siemens kaynak bağlantıları

gösterilir.

### Bilgi Bankası

Doğrulanmış hata kodlarında arama yapılabilir.

Arama alanı şunları destekler:

- hata kodu,
- Türkçe/İngilizce arıza adı,
- üretici,
- model ailesi,
- ilgili parametre kodu.

Örneğin `F07900`, `f79`, `motor bloke` veya `p2175` ile ilgili kayda ulaşılabilir.

### Siemens G120 Hızlı Devreye Alma

V1 kapsamı:

- Siemens SINAMICS G120
- CU240B-2 / CU240E-2 ailesi
- IEC asenkron motor
- manuel / BOP-2 rehberli devreye alma

Wizard şu adımları içerir:

1. Sürücü bilgileri
2. Motor etiket bilgileri
3. Uygulama ve kumanda yöntemi
4. Hız ve rampa ayarları
5. Motor identification koşulları
6. Özet ve parametre planı

Üretilen rehberde kullanılan örnek parametre grupları:

- `p0010` — hızlı devreye alma filtresi
- `p0100` — IEC / NEMA standardı
- `p0300` — motor tipi
- `p0304` / `p0305` / `p0307` / `p0308` — motor etiket verileri
- `p0310` / `p0311` — nominal frekans ve hız
- `p1080` / `p1082` — minimum / maksimum hız
- `p1120` / `p1121` — hızlanma / yavaşlama rampaları
- `p1900` — motor identification
- `p3900` — hızlı devreye alma tamamlama

Ayrıca:

- Y/Δ motor etiketi tutarlılık kontrolü,
- 0–10 V analog hız referansı,
- 4–20 mA analog hız referansı,
- PROFINET / PLC temel rehberi,
- Standard Telegram 1 (PZD 2/2) açıklaması,
- ilk çalıştırma kontrol listesi,
- teşhis modülüne veri aktarımı

bulunur.

### Arıza Geçmişi

Teşhis sonuçları kullanıcı isterse tarayıcının `localStorage` alanına kaydedilir.

- Ayrıntıları görüntüleme
- Yeniden açıp güncel kurallarla tekrar analiz etme
- Tek kayıt silme
- Tüm geçmişi temizleme
- Arama ve ekipman filtresi

> V1'de kayıtlar yalnızca kullanılan tarayıcıda saklanır; cihazlar arasında senkronize edilmez.

### Bakım Dashboard

Arıza geçmişinden otomatik olarak:

- toplam teşhis sayısı,
- motor / VFD dağılımı,
- doğrulanmış üretici kodu sayısı,
- son teşhisler,
- en sık karşılaşılan arızalar,
- VFD üretici dağılımı

gösterilir.

## Teknolojiler

- React
- TypeScript
- Vite
- CSS
- Browser Local Storage
- Git / GitHub
- Vercel

Backend veya veritabanı V1 kapsamında kullanılmamaktadır.

## Yerel geliştirme

Gereksinimler:

- Node.js
- npm
- Git

Projeyi çalıştırmak için:

```bash
git clone https://github.com/menes97/smart-fault-diagnosis.git
cd smart-fault-diagnosis
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Veri ve teşhis yaklaşımı

Uygulamada üç temel ilke kullanılır:

1. **Ölçüm verisi, genel belirti seçimlerinden daha güçlü kanıttır.**
2. **İşaretlenmemiş belirti, ters durumun doğru olduğu anlamına gelmez; bilinmeyen kabul edilir.**
3. **Boş ölçüm ile gerçek `0` değeri birbirinden ayrılır.**

Teşhis puanları olasılık değildir; kural tabanlı **eşleşme skorlarıdır**.

## Güvenlik

Bu uygulama **eğitim ve bakım rehberliği amacıyla** geliştirilmiştir.

- Canlı elektrik tesisatında çalışma talimatı vermez.
- Koruma ve Safety Integrated fonksiyonlarının bypass edilmesini önermez.
- STO / PROFIsafe gibi güvenlik fonksiyonlarının yerine geçmez.
- Sürücüye otomatik parametre yazmaz veya gerçek ekipmanı kontrol etmez.
- Parametre ve bağlantılar sahada yetkili personel tarafından üretici dokümantasyonuna göre doğrulanmalıdır.

Motor identification ve ilk çalıştırma sırasında motor veya bağlı mekanizma hareket edebilir. Çalışma alanı güvenli hale getirilmeden test yapılmamalıdır.

## V1 sınırlamaları

- Kullanıcı hesabı yoktur.
- Bulut tabanlı geçmiş senkronizasyonu yoktur.
- Sürücüye doğrudan bağlantı / parametre yazma yoktur.
- G120 hızlı devreye alma rehberi yalnızca tanımlanan V1 kapsamı için tasarlanmıştır.
- Üretici hata kodu veritabanı seçili doğrulanmış kayıtlarla sınırlıdır.

## Yol haritası

Planlanan geliştirmeler:

- Yaskawa V1000 hızlı devreye alma rehberi
- Danfoss VLT hızlı devreye alma rehberi
- G120 doğrulanmış hata kodu kapsamını genişletme
- Bulut tabanlı kullanıcı hesabı ve teşhis geçmişi
- Motor etiket fotoğrafından veri çıkarma
- Daha gelişmiş bakım raporları
- Mobil kullanım iyileştirmeleri

## Canlı sürüm

https://smart-fault-diagnosis.vercel.app/

## Lisans / kullanım

Henüz özel bir açık kaynak lisansı tanımlanmamıştır. Kaynak kodun kullanım koşulları ileride ayrıca belirtilecektir.
