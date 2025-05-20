import { useState, useEffect, useRef, createContext } from "react";
import "./App.css";
import ParticlesBackground from "./ParticlesBackground";


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
    if (url === "/") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [url]);

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
      // count 100 olunca 750ms sonra intro'yu gizle
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2250);
      return () => clearTimeout(timer);
    }
  }, [count]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [url]);

  return (
    <>
      {showIntro && (
        <div className={`intro-screen ${!showIntro ? "fade-out" : ""}`}>
          <ParticlesBackground />
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleHashChange = () => {
      setActivePage(location.hash || "#/");
      setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className={`navbar ${isMobile ? "mobile" : ""}`}>
      <div className="navbar-inner">
        <div className="brand">Ömer KULUÇ</div>

        {isMobile && (
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? "open" : ""}></span>
            <span className={menuOpen ? "open" : ""}></span>
            <span className={menuOpen ? "open" : ""}></span>
          </div>
        )}

        <ul className={`navbar-items ${menuOpen ? "open" : ""}`}>
          <li><a href="#/" className={`nav-item ${activePage === "#/" ? "active" : ""}`}>Home</a></li>
          <li><a href="#/about" className={`nav-item ${activePage === "#/about" ? "active" : ""}`}>About</a></li>
          <li><a href="#/works" className={`nav-item ${activePage === "#/works" ? "active" : ""}`}>Works</a></li>
          <li><a href="#/contact" className={`nav-item ${activePage === "#/contact" ? "active" : ""}`}>Contact</a></li>
        </ul>
      </div>
    </div>
  );
}

function Home() {
  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState(0);
  const totalSections = 3;

  const sectionLabels = ["About", "Works", "Contact"];
  const sectionHashes = ["#/about", "#/works", "#/contact"];

  const scrollToSection = (index, shouldUpdateHash = false) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: "smooth" });
      setActiveSection(index);
      if (shouldUpdateHash) {
        window.location.hash = sectionHashes[index];
      }
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const next = e.deltaY > 0
      ? (activeSection + 1) % totalSections
      : (activeSection - 1 + totalSections) % totalSections;
    scrollToSection(next);
  };

  const setSectionRef = (el, index) => {
    sectionRefs.current[index] = el;
  };

  const leftIndex = (activeSection - 1 + totalSections) % totalSections;
  const rightIndex = (activeSection + 1) % totalSections;

  const handleBubbleClick = (index) => {
    scrollToSection(index, true);
  };

  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    const index = sectionHashes.findIndex(h => h === hash);
    if (index !== -1) {
      scrollToSection(index);
    }
  }, []);

  // ✅ Wheel event için passive false olarak listener ekle
  useEffect(() => {
    const container = document.querySelector(".home-page-container");
    container?.addEventListener("wheel", handleWheel, { passive: false });


    return () => {
      container?.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  return (
    <div className="home-page-container">
      <ParticlesBackground />

      <section ref={(el) => setSectionRef(el, 0)} className="home-section section-about">
        <h1>About</h1>
      </section>
      <section ref={(el) => setSectionRef(el, 1)} className="home-section section-works">
        <h1>Works</h1>
      </section>
      <section ref={(el) => setSectionRef(el, 2)} className="home-section section-contact">
        <h1>Contact</h1>
      </section>

      <div className="side-bubbles">
        <div className="bubble left visible" onClick={() => handleBubbleClick(leftIndex)}>
          <span>{sectionLabels[leftIndex]}</span>
        </div>

        <div className="bubble center active" onClick={() => handleBubbleClick(activeSection)}>
          <span><img src="/img/go-to-link-icon.svg" alt="" /></span>
        </div>

        <div className="bubble right visible" onClick={() => handleBubbleClick(rightIndex)}>
          <span>{sectionLabels[rightIndex]}</span>
        </div>
      </div>

    </div>
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
            entry.target.classList.add("visible");
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
      <div className="about-animation-wrapper">
        <h2 className="about-header">ABOUT</h2>
        <div className="about-section">
          {sections.map((section, i) => (
            <div
              key={i}
              ref={(el) => (sectionRefs.current[i] = el)}
              className={`${section.className} about-box box-${i + 1}`}
              style={{ "--i": i }}
            >
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


function Works({ data }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState("slide-in-left");
  const [currentProject, setCurrentProject] = useState(null);
  const detailRef = useRef(null);

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
    <div className={`works-page ${currentProject ? "project-open" : ""}`}>
      <div className="keyboard-container">
        {data.map((project, index) => (
          <button
            key={project.id}
            className={`key ${currentProject?.id === project.id ? "active-key" : ""}`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => setSelectedProject(project)}
          >
            {project.title}
          </button>
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

          <p>{currentProject.info}</p>
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
        <h2 className="contact-header">CONTACT</h2>

        <div className="contact-card">
          {/* Oklar */}
          <div className="desktop-only">
            <div className="arrow arrow-top">↓</div>
            <div className="arrow arrow-right">←</div>
            <div className="arrow arrow-bottom">↑</div>
            <div className="arrow arrow-left">→</div>
          </div>

          {/* Asıl içerik */}
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
                  </div>
                  <div onClick={() => window.open("https://github.com/omer-kuluc", "_blank")} className="github-area">
                    <img src="/img/github-icon.svg" alt="" />
                  </div>
                  <div onClick={() => window.open("https://www.linkedin.com/in/%C3%B6mer-kulu%C3%A7-8a03291b6/", "_blank")} className="linkedin-area">
                    <img src="/img/linkedin-icon.svg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}


function NotFound() {
  return (
    <>
      <h2>Sayfa bulunamadı</h2>
    </>
  )
}

export default App;
