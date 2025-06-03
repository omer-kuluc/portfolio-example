import { useState, useEffect, useRef, createContext } from "react";
import "./App.css";
import ParticlesBackground from "./ParticlesBackground";
import { motion, AnimatePresence } from "framer-motion";

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
      }, 2000);
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
  const [isScrolling, setIsScrolling] = useState(false);
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

  const handleScroll = (direction) => {
    if (isScrolling) return;
    setIsScrolling(true);

    const next =
      direction === "down"
        ? (activeSection + 1) % totalSections
        : (activeSection - 1 + totalSections) % totalSections;

    scrollToSection(next);

    setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // Scroll kilidi
  };

  // Touch swipe destek
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 50) {
        handleScroll(deltaY > 0 ? "down" : "up");
      }
    };

    const container = document.querySelector(".home-page-container");
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeSection, isScrolling]);

  // Wheel destek
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      handleScroll(e.deltaY > 0 ? "down" : "up");
    };

    const container = document.querySelector(".home-page-container");
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [activeSection, isScrolling]);

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
    const index = sectionHashes.findIndex((h) => h === hash);
    if (index !== -1) {
      scrollToSection(index);
    }
  }, []);

  return (
    <div className="home-page-container">
      <ParticlesBackground />

      <div className="scroll-hint">You can scroll ↓</div>

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
      title: "Computer Engineering Graduate and Software Foundations",
      className: "about-school-section",
      content: `With a background in computer engineering, I built a strong foundation in software development. I focus not just on functionality but also on writing efficient and maintainable code. My education gave me a deep understanding of core programming principles.`
    },
    {
      title: "Front-End Training at Acunmedya Academy",
      className: "about-course-section",
      content: `At Acunmedya Academy, I received intensive training in HTML, CSS, JavaScript, and React. I gained hands-on experience in creating user-friendly interfaces and managing data through APIs. I also learned how to use GitHub for version control and project collaboration.`
    },
    {
      title: "A Front-End Developer Passionate About Modern Web Technologies",
      className: "about-front-end-section",
      content: `My passion for technology led me to front-end development. I create interactive and high-performance interfaces using React. Writing clean, scalable, and sustainable code is one of my core priorities.`
    },
    {
      title: "Career Goals as a Front-End Developer",
      className: "about-future-section",
      content: `My goal is to work on projects with exceptional user experience. I stay updated with new technologies and aim to create impactful and lasting solutions as a creative and open-minded developer.`
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
  const pRef = useRef(null);
  const lastDirection = useRef("left");

  useEffect(() => {
    if (!selectedProject) return;

    if (!currentProject) {
      setCurrentProject(selectedProject);
      setAnimationClass("slide-in-left");
      return;
    }

    if (selectedProject.id === currentProject.id) return;

    setAnimating(true);
    const exitClass = lastDirection.current === "left" ? "slide-out-right" : "slide-out-left";
    const enterClass = lastDirection.current === "left" ? "slide-in-left" : "slide-in-right";
    setAnimationClass(exitClass);

    const timeout = setTimeout(() => {
      setCurrentProject(selectedProject);
      setAnimationClass(enterClass);
      setAnimating(false);

      if (pRef.current) pRef.current.scrollTop = 0;
      if (window.innerWidth < 768 && detailRef.current) {
        detailRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [selectedProject]);

  const handleNext = () => {
    if (!currentProject) return;
    lastDirection.current = "left";
    const currentIndex = data.findIndex((p) => p.id === currentProject.id);
    const nextIndex = (currentIndex + 1) % data.length;
    setSelectedProject(data[nextIndex]);
  };

  const handlePrev = () => {
    if (!currentProject) return;
    lastDirection.current = "right";
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
            onClick={() => {
              lastDirection.current = "left";
              setSelectedProject(project);
            }}
          >
            {project.title}
          </button>
        ))}
      </div>

      {currentProject && (
        <div
          ref={detailRef}
          className={`project-detail-area ${animationClass}`}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}
        >
          <button className="nav-arrow left" onClick={handlePrev}>
            <img src="/img/circle-arrow-left.svg" alt="Prev" className="arrow-icon" />
          </button>

          <div className="project-content" style={{ flex: 1 }}>
            <img
              src={currentProject.image}
              alt={currentProject.title}
              onClick={() => window.open(currentProject.liveLink, "_blank")}
              className="project-image"
            />
            <h3>{currentProject.title}</h3>
            <p ref={pRef}>{currentProject.info}</p>

            <div className="project-buttons">
              <a href={currentProject.liveLink} target="_blank" rel="noopener noreferrer">
                <img className="live-link-icon" src="/img/live-link-icon.svg" alt="" />
              </a>
              <a href={currentProject.githubLink} target="_blank" rel="noopener noreferrer">
                <img className="github-icon" src="/img/works-github-icon.svg" alt="" />
              </a>
            </div>
          </div>

          <button className="nav-arrow right" onClick={handleNext}>
            <img src="/img/circle-arrow-right.svg" alt="Next" className="arrow-icon" />
          </button>
        </div>
      )}


    </div>
  );
}




function Contact() {
  const [showCard, setShowCard] = useState(true);
  const [animationEnded, setAnimationEnded] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Do you want to still contact ?");
  const [buttonFade, setButtonFade] = useState(false);
  const [buttonRemoved, setButtonRemoved] = useState(false); // ✅ yeni

  useEffect(() => {
    if (animationEnded) {
      const timer = setTimeout(() => {
        setShowCard(false);
        setButtonVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animationEnded]);

  useEffect(() => {
    if (buttonText === "So, you can write..") {
      const fadeTimer = setTimeout(() => {
        setButtonFade(true);
        setTimeout(() => {
          setButtonRemoved(true); // ✅ tamamen kaldır
        }, 6500);
      }, 500); // yazı biraz görünür kalmalı
      return () => clearTimeout(fadeTimer);
    }
  }, [buttonText]);

  const handleButtonClick = () => {
    if (buttonText === "So, you can write..") return; // ✅ ikinci tıklamayı engelle
    setShowCard(true);
    setButtonText("So, you can write..");
    setButtonFade(false);
  };

  return (
    <div className="contact-inner">
      <h2 className="contact-header">CONTACT</h2>

      <AnimatePresence>
        {showCard && (
          <motion.div
            className="contact-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 1.5, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              scale: 0,
              transition: { duration: 1.0, ease: "easeInOut" },
            }}
            onAnimationComplete={() => setAnimationEnded(true)}
          >
            <div className="desktop-only">
              <div className="arrow arrow-top">↓</div>
              <div className="arrow arrow-right">←</div>
              <div className="arrow arrow-bottom">↑</div>
              <div className="arrow arrow-left">→</div>
            </div>

            <div className="contact-content">
              <img
                className="profil-photo"
                src="/img/profil.jpg"
                alt="Profil Fotoğrafı"
              />
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
                    <div
                      onClick={() =>
                        (window.location.href = "mailto:kuluc.omer@gmail.com")
                      }
                      className="email-card"
                    >
                      <img
                        className="email-icon"
                        src="/img/envelope-icon.svg"
                        alt=""
                      />
                    </div>
                    <div
                      onClick={() =>
                        window.open("https://github.com/omer-kuluc", "_blank")
                      }
                      className="github-area"
                    >
                      <img src="/img/github-icon.svg" alt="" />
                    </div>
                    <div
                      onClick={() =>
                        window.open(
                          "https://www.linkedin.com/in/%C3%B6mer-kulu%C3%A7-8a03291b6/",
                          "_blank"
                        )
                      }
                      className="linkedin-area"
                    >
                      <img src="/img/linkedin-icon.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {buttonVisible && !buttonRemoved && (
        <motion.button
          className={`contact-toggle-button ${buttonFade ? "fade-out-button" : ""}`}
          onClick={handleButtonClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          {buttonText}
        </motion.button>
      )}
    </div>
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
