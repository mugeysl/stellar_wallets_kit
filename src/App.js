import { useState } from "react";
import "./index.css";
import StellarWalletConnection from "./components/StellarWalletConnection/StellarWalletConnection";
import EstablishTrustlineComponent from "./components/EstablishTrustlineComponent/EstablishTrustlineComponent";
import { callContractMethod } from "./utils/contract"; // 🔹 yeni

const initialProjects = [
  {
    id: 1,
    category: "Web Geliştirme",
    title: "E-Ticaret Web Sitesi Geliştirilmesi",
    description:
      "Modern ve responsive bir e-ticaret platformu. Ödeme entegrasyonu ve yönetim paneli gerekiyor.",
    tags: ["Next.js", "React", "Tailwind CSS"],
    budgetMin: 3000,
    budgetMax: 6000,
    duration: "3 hafta",
    applicants: 12,
  },
  {
    id: 2,
    category: "Blockchain",
    title: "NFT Marketplace Smart Contract",
    description:
      "Stellar üzerinde çalışacak basit bir NFT marketplace için escrow destekli smart contract.",
    tags: ["Soroban", "Stellar", "Smart Contracts"],
    budgetMin: 1500,
    budgetMax: 3500,
    duration: "2 hafta",
    applicants: 8,
  },
  {
    id: 3,
    category: "Tasarım",
    title: "Mobil Uygulama UI/UX Tasarımı",
    description:
      "Fintech mobil uygulaması için modern ve kullanıcı dostu arayüz tasarımı.",
    tags: ["Figma", "UI/UX", "Mobile Design"],
    budgetMin: 800,
    budgetMax: 2000,
    duration: "10 gün",
    applicants: 15,
  },
];

function App() {
  const [walletInfo, setWalletInfo] = useState({
    publicKey: null,
    kit: null,
  });

  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null);

  // 🔹 AŞAMA 3: Kullanıcı trustline kurdu mu?
  const [hasTrustline, setHasTrustline] = useState(false);

  // 🔹 AŞAMA 4: Hangi projede escrow fonlama yapılacak?
  const [activeProjectId, setActiveProjectId] = useState(null);

  const scrollToProjects = () => {
    const el = document.getElementById("open-projects");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWallet = () => {
    const el = document.getElementById("wallet-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuickPostProject = () => {
    const title = window.prompt("Proje başlığı:");
    if (!title) return;
    const budget = window.prompt("Bütçe (XLM):", "500");

    const newProject = {
      id: Date.now(),
      category: "Web3 / AI",
      title,
      description:
        "Bu proje hızlı oluşturuldu. Detaylar daha sonra düzenlenebilir.",
      tags: ["AI", "Stellar", "Escrow"],
      budgetMin: Number(budget) || 0,
      budgetMax: Number(budget) || 0,
      duration: "2 hafta",
      applicants: 0,
    };

    setProjects((prev) => [newProject, ...prev]);
    scrollToProjects();
  };

  const handleApply = (projectId) => {
    if (!walletInfo.publicKey) {
      alert("Teklif verebilmek için önce wallet bağlamalısın. 🙂");
      scrollToWallet();
      return;
    }

    const proposal = window.prompt("Kısa bir teklif mesajı yaz:");
    if (!proposal) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              applicants: (p.applicants || 0) + 1,
              appliedByMe: true,
              myProposal: proposal,
            }
          : p
      )
    );

    // 🔹 Kullanıcı teklif verdiği projeyi aktif proje yapıyoruz
    setActiveProjectId(projectId);

    alert(
      "Teklifin kaydedildi (şu an demo). Escrow akışı smart contract ile çalışacak. 🚀"
    );
  };

  // ✅ Escrow işlemlerinden önce ortak kontroller
  const checkEscrowPreconditions = () => {
    if (!walletInfo.publicKey || !walletInfo.kit) {
      alert("Önce wallet bağlamalısın.");
      scrollToWallet();
      return false;
    }

    if (!hasTrustline) {
      alert("Önce trustline kurmalısın.");
      scrollToWallet();
      return false;
    }

    if (!activeProjectId) {
      alert("Önce bir proje seçmelisin (kartlara tıklayıp seçebilirsin).");
      scrollToProjects();
      return false;
    }

    return true;
  };

  // 🔹 Escrow'u fonla
  const handleFundEscrow = async () => {
    if (!checkEscrowPreconditions()) return;

    try {
      await callContractMethod({
        method: "fund",
        args: [String(activeProjectId)], // contract fonksiyonun ne bekliyorsa
        publicKey: walletInfo.publicKey,
        kit: walletInfo.kit,
      });

      alert("🔒 Escrow Smart Contract'ta fonlandı!");
    } catch (e) {
      console.error(e);
      alert("❌ Escrow fonlanırken hata oluştu.");
    }
  };

  // 🔹 İş teslim et
  const handleDeliverWork = async () => {
    if (!checkEscrowPreconditions()) return;

    try {
      await callContractMethod({
        method: "deliver",
        args: [String(activeProjectId)],
        publicKey: walletInfo.publicKey,
        kit: walletInfo.kit,
      });

      alert("📤 İş teslim edildi (contract'a bildirildi)!");
    } catch (e) {
      console.error(e);
      alert("❌ İş teslim çağrısında hata oluştu.");
    }
  };

  // 🔹 Ödemeyi serbest bırak
  const handleReleasePayment = async () => {
    if (!checkEscrowPreconditions()) return;

    try {
      await callContractMethod({
        method: "release",
        args: [String(activeProjectId)],
        publicKey: walletInfo.publicKey,
        kit: walletInfo.kit,
      });

      alert("💸 Ödeme serbest bırakıldı!");
    } catch (e) {
      console.error(e);
      alert("❌ Ödeme serbest bırakılırken hata oluştu.");
    }
  };

  return (
    <div className="App">
      {/* -------- NAVBAR -------- */}
      <header className="tw-navbar">
        <div className="tw-logo">
          <span className="tw-logo-badge">W3</span>
          <span>TrustWork</span>
        </div>

        <nav className="tw-nav-links">
          <button onClick={scrollToProjects}>Projeler</button>
          <button
            onClick={() =>
              document
                .getElementById("how-it-works")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Nasıl Çalışır
          </button>
        </nav>

        <div className="tw-nav-actions">
          <button className="tw-wallet-btn" onClick={scrollToWallet}>
            🪪 Wallet Bağla
          </button>
          <button className="tw-primary-small" onClick={handleQuickPostProject}>
            Proje Yayınla
          </button>
        </div>
      </header>

      {/* -------- HERO -------- */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Blockchain ile Güvenli İş Takibi
        </div>

        <h1 className="hero-title">
          Freelancer ve Müşteri Arasında
          <br />
          <span>Güven Sorunu Çözüldü</span>
        </h1>

        <p className="hero-subtitle">
          Soroban smart contract ile güvenli escrow sistemi. Ödeme Stellar
          ağında kilitlenir, iş AI tarafından onaylandığında freelancer’a
          aktarılır.
        </p>

        <div className="hero-buttons">
          <button className="tw-primary" onClick={scrollToProjects}>
            Projeleri Keşfet
          </button>
          <button className="tw-secondary" onClick={scrollToWallet}>
            Freelancer Ol
          </button>
        </div>

        <div className="hero-features-row">
          <div className="hero-feature-card">
            <div className="hero-feature-icon">🛡️</div>
            <h3>Güvenli Escrow</h3>
            <p>Smart contract ile ödeme güvencesi.</p>
          </div>
          <div className="hero-feature-card">
            <div className="hero-feature-icon">⚡</div>
            <h3>Anında Transfer</h3>
            <p>İş bitince otomatik ödeme.</p>
          </div>
          <div className="hero-feature-card">
            <div className="hero-feature-icon">🤖</div>
            <h3>AI Onay Mekanizması</h3>
            <p>İş kalitesi AI ile değerlendirilir.</p>
          </div>
        </div>
      </section>

      {/* -------- AÇIK PROJELER -------- */}
      <section id="open-projects" className="projects-section">
        <div className="projects-header">
          <div>
            <h2>Açık Projeler</h2>
            <p className="projects-sub">
              Hemen başvur, blockchain ile güvenli ödemeni al
            </p>
          </div>
        </div>

        <div className="project-grid">
          {projects.map((p) => (
            <div
              className="project-card"
              key={p.id}
              onClick={() => {
                setSelectedProject(p);
                setActiveProjectId(p.id); // 🔹 proje seçilince activeProjectId güncelleniyor
              }}
            >
              <div className="project-card-top">
                <span className="project-category">{p.category}</span>
                <span className="project-people">👥 {p.applicants}</span>
              </div>

              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.description}</p>

              <div className="project-tags">
                {p.tags.map((t, i) => (
                  <span key={i} className="tag">
                    {t}
                  </span>
                ))}
              </div>

              <div className="project-info">
                <span className="project-budget">
                  $ {p.budgetMin} - {p.budgetMax} USDT
                </span>
                <span className="project-duration">⏳ {p.duration}</span>
              </div>

              <button
                className={p.appliedByMe ? "apply-btn applied" : "apply-btn"}
                onClick={(e) => {
                  e.stopPropagation();
                  !p.appliedByMe && handleApply(p.id);
                }}
              >
                {p.appliedByMe ? "Teklif Gönderildi" : "Teklif Ver"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* -------- PROJE DETAY MODAL -------- */}
      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProject.title}</h2>
            <p>{selectedProject.description}</p>

            <h4>Teklif Durumu</h4>
            {selectedProject.appliedByMe ? (
              <p>Senin teklifin: {selectedProject.myProposal}</p>
            ) : (
              <p>Henüz teklif vermedin.</p>
            )}

            <button
              className="tw-primary"
              onClick={() => handleApply(selectedProject.id)}
            >
              Teklif Ver
            </button>

            <button
              className="tw-secondary-light"
              onClick={() => setSelectedProject(null)}
              style={{ marginTop: "12px" }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* -------- NASIL ÇALIŞIR -------- */}
      <section id="how-it-works" className="how-section">
        <h2>Nasıl Çalışır?</h2>
        <p className="how-sub">
          Blockchain ile güvenli ve şeffaf bir freelance deneyimi
        </p>

        <div className="how-grid">
          {[
            {
              title: "Proje Yayınla",
              desc: "Müşteri projeyi platforma ekler ve bütçeyi belirler.",
            },
            {
              title: "Teklif Al & Seç",
              desc: "Freelancer teklif verir, müşteri en uygunu seçer.",
            },
            {
              title: "Smart Contract Escrow",
              desc: "Ödeme Soroban contract’a kilitlenir.",
            },
            {
              title: "Teslimat & Ödeme",
              desc: "AI doğrular, ödeme freelancer’a geçer.",
            },
          ].map((s, i) => (
            <div key={i} className="how-card">
              <div className="step-number">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------- GÜVENLİK BANNER -------- */}
      <section className="security-banner">
        <div>
          <h3>Blockchain ile %100 Güvenli</h3>
          <p>Ödeme smart contract’ta kilitlenir, taraflar asla mağdur olmaz.</p>
        </div>
        <div className="security-stats">
          <div>
            <div className="stat-value">$2.5M</div>
            <div className="stat-label">Güvenli Ödeme</div>
          </div>
          <div>
            <div className="stat-value">450+</div>
            <div className="stat-label">Tamamlanan İş</div>
          </div>
        </div>
      </section>

      {/* -------- WALLET & ESCROW -------- */}
      <section id="wallet-section" className="wallet-section-wrapper">
        <h2>Wallet Bağlantısı & Escrow</h2>
        <p className="wallet-section-sub">
          Wallet bağla → Trustline kur → Escrow ödemelerini başlat.
        </p>

        <StellarWalletConnection onConnect={setWalletInfo} />

        {walletInfo.publicKey && walletInfo.kit && (
          <>
            <div className="trustline-box">
              <h3>Trustline Kur</h3>
              <p>Özel asset için trustline oluştur.</p>

              <EstablishTrustlineComponent
                publicKey={walletInfo.publicKey}
                kit={walletInfo.kit}
                onSuccess={() => setHasTrustline(true)} // 🔹 AŞAMA 3
              />
            </div>

            {/* ------ ESCROW DEMO → GERÇEK ------ */}
            <div className="escrow-action-box">
              <h3>Escrow İşlemleri</h3>
              <p>
                Bu bölüm artık smart contract çağrılarıyla çalışacak. Fund →
                Deliver → Release.
              </p>

              <div className="escrow-buttons">
                <button className="tw-primary" onClick={handleFundEscrow}>
                  Escrow'u Fonla
                </button>

                <button className="tw-secondary" onClick={handleDeliverWork}>
                  İş Teslim Et
                </button>

                <button
                  className="tw-primary-small"
                  onClick={handleReleasePayment}
                >
                  Ödemeyi Serbest Bırak
                </button>
              </div>
            </div>

            {/* ------ AI VERIFICATION (şimdilik demo) ------ */}
            <div className="ai-verification-box">
              <h3>AI İş Doğrulama</h3>
              <p>AI, teslim edilen işin kalitesini değerlendirir.</p>

              <button
                className="tw-secondary"
                onClick={() =>
                  alert(
                    "🤖 AI Analizi (Demo): Çalışma yüksek kalite! Ödeme serbest bırakılabilir."
                  )
                }
              >
                AI Analiz Yap
              </button>
            </div>
          </>
        )}
      </section>

      {/* -------- FOOTER -------- */}
      <footer className="tw-footer">
        <div className="footer-left">
          <div className="tw-logo">
            <span className="tw-logo-badge">W3</span>
            <span>TrustWork</span>
          </div>
          <p>Blockchain ile güvenli freelance platformu.</p>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Platform</h4>
            <a href="#open-projects">Projeler</a>
            <a href="#how-it-works">Nasıl Çalışır</a>
          </div>
          <div>
            <h4>Destek</h4>
            <a href="#">Yardım Merkezi</a>
            <a href="#">SSS</a>
            <a href="#">İletişim</a>
          </div>
          <div>
            <h4>Yasal</h4>
            <a href="#">Kullanım Koşulları</a>
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Smart Contract</a>
          </div>
        </div>

        <div className="footer-bottom">
          © 2025 TrustWork. Built for Hackstellar Hackathon 🚀
        </div>
      </footer>
    </div>
  );
}

export default App;
