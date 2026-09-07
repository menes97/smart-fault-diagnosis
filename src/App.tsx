import { useState } from 'react'
import './App.css'

const equipmentOptions = ['Üç Fazlı Elektrik Motoru', 'Frekans Konvertörü / VFD', 'Endüstriyel Sensör']
const symptoms = ['Motor ısınıyor', 'Akım nominal değerin üzerinde', 'Mekanik ses var', 'Motor dönmüyor', 'Sigorta açıyor', 'Titreşim artmış']
type IconName = 'dashboard' | 'diagnosis' | 'history' | 'library' | 'settings'

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    diagnosis: <><path d="M12 2v4" /><path d="m15.5 7.5 2.8-2.8" /><path d="M18 12h4" /><path d="m15.5 16.5 2.8 2.8" /><path d="M12 18v4" /><path d="m8.5 16.5-2.8 2.8" /><path d="M6 12H2" /><path d="m8.5 7.5-2.8-2.8" /><circle cx="12" cy="12" r="4" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></>,
    library: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.1 2.1-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20.3h-3v-.1A1.7 1.7 0 0 0 10.75 18.65a1.7 1.7 0 0 0-1.88.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 0 0 7.1 15a1.7 1.7 0 0 0-1.55-1H5.4v-3h.15A1.7 1.7 0 0 0 7.1 10a1.7 1.7 0 0 0-.34-1.88L6.7 8.06l2.1-2.1.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V4.7h3v.1a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.1 2.1-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.55 1h.15v3h-.15a1.7 1.7 0 0 0-1.55 1Z" /></>,
  }
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{paths[name]}</svg>
}

function App() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const navItems: { label: string; icon: IconName; active?: boolean }[] = [
    { label: 'Dashboard', icon: 'dashboard' }, { label: 'Yeni Teşhis', icon: 'diagnosis', active: true },
    { label: 'Arıza Geçmişi', icon: 'history' }, { label: 'Bilgi Bankası', icon: 'library' }, { label: 'Ayarlar', icon: 'settings' },
  ]
  const toggleSymptom = (symptom: string) => setSelectedSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom])

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">⚡</span><span>AKILLI ARIZA<br /><strong>TEŞHİS SİSTEMİ</strong></span></div>
      <nav aria-label="Ana menü">{navItems.map((item) => <button className={`nav-item ${item.active ? 'active' : ''}`} key={item.label} type="button"><Icon name={item.icon} />{item.label}</button>)}</nav>
      <div className="sidebar-footer"><span className="status-dot" />Sistem çevrimiçi</div>
    </aside>
    <main className="main-content">
      <header className="page-header"><div><p className="eyebrow">TEŞHİS MERKEZİ</p><h1>Yeni Arıza Teşhisi</h1><p className="subtitle">Ekipman bilgilerini girin, sistem olası arızaları değerlendirsin.</p></div><div className="header-date">07 Eylül 2026 <span>•</span> Pazartesi</div></header>
      <div className="workspace">
        <section className="form-card" aria-labelledby="form-title">
          <div className="card-heading"><div className="heading-icon">⌁</div><div><h2 id="form-title">Ekipman Bilgileri</h2><p>Teşhis için gerekli alanları doldurun.</p></div></div>
          <form onSubmit={(event) => event.preventDefault()}>
            <div className="form-grid"><label>EKİPMAN TÜRÜ<select defaultValue=""><option value="" disabled>Ekipman seçiniz</option>{equipmentOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label>MARKA / MODEL<input placeholder="Örn: Siemens 1LE1001" /></label></div>
            <label className="full-field">PROBLEM TANIMI<textarea rows={3} placeholder="Gözlemlediğiniz problemi kısaca açıklayın..." /></label>
            <fieldset><legend>BELİRTİLER <span>Uygun olanları seçin</span></legend><div className="symptoms">{symptoms.map((symptom) => <label className="checkbox-label" key={symptom}><input type="checkbox" checked={selectedSymptoms.includes(symptom)} onChange={() => toggleSymptom(symptom)} /><span className="checkmark">✓</span>{symptom}</label>)}</div></fieldset>
            <div className="form-grid electrical-fields"><label>NOMİNAL AKIM <div className="input-suffix"><input type="number" placeholder="0.00" step="0.01" /><span>A</span></div></label><label>ÖLÇÜLEN AKIM <div className="input-suffix"><input type="number" placeholder="0.00" step="0.01" /><span>A</span></div></label></div>
            <button className="analyze-button" type="submit"><span>⌁</span> ARIZAYI ANALİZ ET <b>→</b></button>
          </form>
        </section>
        <aside className="result-card" aria-label="Teşhis sonucu"><div className="result-heading"><span className="result-icon">◈</span><div><p className="eyebrow">ANALİZ ÇIKTISI</p><h2>Teşhis Sonucu</h2></div></div><div className="result-placeholder"><div className="placeholder-icon">⌁</div><p>Teşhis sonucu burada<br />görüntülenecek.</p><span>Formu doldurup analizi başlatın.</span></div></aside>
      </div>
    </main>
  </div>
}
export default App

