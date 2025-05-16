import { useState, useEffect, useRef, createContext } from "react";
import "./App.css";



const routes = [
  {
    url: '/',
    component: <Home />
  },
  {
    url: "/about",
    component: <About />
  },
  {
    url: "/works",
    component: <Works />
  },
  {
    url: "/contact",
    component: <Contact />
  },

];


const notFound = {
  component: <NotFound />
}

function getPage(url) {
  return routes.findLast(x => url.startsWith(x.url)) ?? notFound;
}

const PageContext = createContext(null);

function App() {
  const [data, setData] = useState(null);
  const [url, setUrl] = useState(location.hash.substring(1) || "/");
  const [showIntro, setShowIntro] = useState(true);
  const [count, setCount] = useState(0);

  const page = getPage(url);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("/data/data.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const json = await response.json();
        setData(json.worksData ?? []);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setData([]);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    const handleHashChange = () => setUrl(location.hash.substring(1));
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (count < 100) {
      const timer = setTimeout(() => setCount(prev => prev + 1), 40);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setShowIntro(false);
      }, 4750);
    }
  }, [count]);

  return (
    <>
      {showIntro && (
        <div className="intro-screen">
          <div className="intro-text">ÖMER KULUÇ | Front-End Developer</div>
          <div className="count-up">{count}%</div>
        </div>
      )}
      {!showIntro && (
        <div className="fade-in">
          <Header />
          <div className="container">
            <PageContext.Provider value={page}>
              {page.url === "/works" ? <Works data={data} /> : page.component}
            </PageContext.Provider>
          </div>
        </div>
      )}
    </>
  );
}


function Header() {
  const [activePage, setActivePage] = useState(location.hash || "#/");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  /* ↻ ekran boyutu değişince mobil mi kontrol et */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 500);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ↻ hash değişince aktif link & menüyü kapat */
  useEffect(() => {
    const onHash = () => { setActivePage(location.hash || "#/"); setMenuOpen(false); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* .navbar’a “mobile” sınıfı ekleyerek CSS’i tetikleyeceğiz */
  const navbarCls = `navbar${isMobile ? " mobile" : ""}`;

  return (
    <div className={navbarCls}>
      <div className="navbar-inner">
        <div className="brand">Ömer KULUÇ</div>

        {/* hamburger butonu – masaüstünde CSS ile gizli */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={menuOpen ? "open" : ""}></span>
          <span className={menuOpen ? "open" : ""}></span>
          <span className={menuOpen ? "open" : ""}></span>
        </div>

        <ul className={`navbar-items ${menuOpen ? "open" : ""}`}>
          <li><a href="#/" className={`nav-item ${activePage === "#/" ? "active" : ""}`}>Anasayfa</a></li>
          <li><a href="#/about" className={`nav-item ${activePage === "#/about" ? "active" : ""}`}>Hakkımda</a></li>
          <li><a href="#/works" className={`nav-item ${activePage === "#/works" ? "active" : ""}`}>Projelerim</a></li>
          <li><a href="#/contact" className={`nav-item ${activePage === "#/contact" ? "active" : ""}`}>İletişim</a></li>
        </ul>
      </div>
    </div>
  );
}


function Home() {
  return (
    <>
      <div className="home-page-container">
        <div className="profile-area">
          <div className="profile-section">
            <img className="profil-photo" src="/img/profil.jpg" alt="Profil Fotoğrafı" />
            <img src="/img/arrow-icon.svg" alt="" />
            <h2 className="name-tag">Ömer <br />KULUÇ</h2>
          </div>
          <div className="intro-text-area">
            Merhaba,
            Portfolyo sayfama hoş geldiniz. Ben, yeni teknolojileri keşfetmeye meraklı ve tutkulu bir Jr. Front-End Developer'ım.
            Web geliştirme dünyasındaki yolculuğum heyecan verici bir deneyim oldu ve her geçen gün kendimi daha da geliştirmeye çalışıyorum.
          </div>
        </div>
        <About />
        <div className="change-page-options">
          <a href="#/works">Projelerim</a>
          <a href="#/contact">İletişim</a>
        </div>
      </div>
    </>

  );
}

function About() {
  const sectionRefs = useRef([]);

  const sections = [
    {
      title: "Bilgisayar Mühendisliği Mezunu ve Yazılım Temelleri",
      className: "about-school-section",
      content: `Bilgisayar mühendisliği eğitimiyle yazılıma sağlam bir temel attım. Kodlamada sadece çalışabilirlik değil, aynı zamanda verimlilik ve sürdürülebilirlik benim için öncelikli. Yazılım mimarisi ve optimizasyona özel bir ilgim var.`
    },
    {
      title: "Acunmedya Akademi'de Front-End Eğitimi",
      className: "about-course-section",
      content: `Acunmedya Akademi'de HTML, CSS, JavaScript ve React üzerine yoğun bir eğitim aldım. Kullanıcı dostu arayüzler geliştirme, API ile veri yönetimi gibi konularda proje deneyimi kazandım.`
    },
    {
      title: "Modern Web Teknolojilerine Tutkulu Bir Front-End Geliştirici",
      className: "about-front-end-section",
      content: `Teknoloji tutkum beni front-end geliştirmeye yönlendirdi. React ile etkileşimli, performanslı arayüzler geliştiriyorum. Kodun temiz, sürdürülebilir ve ölçeklenebilir olması benim için önemli.`
    },
    {
      title: "Front-End Geliştirici Olarak Kariyer Hedefim",
      className: "about-future-section",
      content: `Hedefim, kullanıcı deneyimi yüksek projelerde yer almak. Yeni teknolojileri takip ediyor, öğrenmeye açık ve yaratıcı çözümler üreten biri olarak sektörde kalıcı işler yapmak istiyorum.`
    }
  ];


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <h2 className="about-header">HAKKIMDA</h2>
      <div className="about-section">
        {sections.map((section, i) => (
          <div
            key={i}
            ref={(el) => (sectionRefs.current[i] = el)}
            className={section.className}
          >
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Works({ data }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState("slide-in-left");
  const [currentProject, setCurrentProject] = useState(null);
  const detailRef = useRef(null); // 👈 Detay alanı referansı

  useEffect(() => {
    if (!selectedProject) return;

    if (!currentProject) {
      setCurrentProject(selectedProject);
      setAnimationClass("slide-in-left");
      return;
    }

    if (selectedProject.id === currentProject.id) return;

    setAnimating(true);
    setAnimationClass("slide-out-right");

    const timeout = setTimeout(() => {
      setCurrentProject(selectedProject);
      setAnimationClass("slide-in-left");
      setAnimating(false);

      // 🌐 Sadece mobilde scroll
      if (window.innerWidth < 768 && detailRef.current) {
        detailRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [selectedProject]);

  const handleNext = () => {
    if (!currentProject) return;
    const currentIndex = data.findIndex((p) => p.id === currentProject.id);
    const nextIndex = (currentIndex + 1) % data.length;
    setSelectedProject(data[nextIndex]);
  };

  const handlePrev = () => {
    if (!currentProject) return;
    const currentIndex = data.findIndex((p) => p.id === currentProject.id);
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    setSelectedProject(data[prevIndex]);
  };

  if (!data || data.length === 0) {
    return <div className="loading-text">Projeler yükleniyor...</div>;
  }

  return (
    <div className="works-page">
      <div className="keyboard-container">
        {data.map((project, index) => (
          <div
            key={project.id}
            className={`key ${currentProject?.id === project.id ? "active-key" : ""}`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => setSelectedProject(project)}
          >
            {project.title}
          </div>
        ))}
      </div>

      {currentProject && (
        <div ref={detailRef} className={`project-detail-area ${animationClass}`}>
          <button className="nav-arrow left" onClick={handlePrev}>‹</button>

          <img
            src={currentProject.image}
            alt={currentProject.title}
            className="project-image"
          />
          <div className="project-buttons">
            <a href={currentProject.liveLink} target="_blank" rel="noopener noreferrer">
              🌐 Canlı Gör
            </a>
            <a href={currentProject.githubLink} target="_blank" rel="noopener noreferrer">
              💻 GitHub
            </a>
          </div>

          <button className="nav-arrow right" onClick={handleNext}>›</button>
        </div>
      )}
    </div>
  );
}

function Contact() {
  return (
    <>
      <div className="contact-inner">
        <h2 className="contact-header">İLETİŞİM</h2>
        <div className="contact-content">
          <img className="profil-photo" src="/img/profil.jpg" alt="Profil Fotoğrafı" />
          <div className="contact-text">
            <div className="name-content">
              <h1>Personal ID</h1>
              <p>Name : Ömer</p>
              <p>Surname : KULUÇ</p>
              <p>Role : Jr Front-End Dev.</p>
            </div>
            <div className="contact-channels">
              <p>Contact : </p>
              <div className="contact-channels-inner">
                <div onClick={() => (window.location.href = "mailto:kuluc.omer@gmail.com")} className="email-card">
                  <img src="/img/email-icon.svg" alt="" />
                  <p className="mobile-none">kuluc.omer@gmail.com</p>
                </div>
                <div onClick={() => window.open("https://github.com/omer-kuluc", "_blank")}
                  className="github-area">
                  <span className="mobile-none">Github :</span>
                  <img src="/img/github-icon.svg" alt="" />
                </div>
                <div onClick={() => window.open("https://www.linkedin.com/in/%C3%B6mer-kulu%C3%A7-8a03291b6/", "_blank")}
                  className="linkedin-area">
                  <span className="mobile-none">Linkedin :</span>
                  <img src="/img/linkedin-icon.svg" alt="" />
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  )
}

function NotFound() {
  return (
    <>
      <h2>Sayfa bulunamadı</h2>
    </>
  )
}

export default App;
