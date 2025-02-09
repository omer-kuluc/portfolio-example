import { useState, useEffect, useRef, createContext } from "react";
import "./App.css";

const routes = [
  {
    url: '/',
    component: <Home/>
  },
  {
    url: "/works",
    component: <Works/>
  },
  {
    url: "/contact",
    component: <Contact/>
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
  const [data,setData] = useState(null);

  const [url, setUrl] = useState(location.hash.substring(1) || '/');

  const page = getPage(url); 

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch('/data/data.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
        const json = await response.json();
        setData(json.worksData ?? []);
      } catch (error) {
        console.error("Fetching error:", error);
        setData([]); // Hata olursa boş array olarak ayarla
      }
    }
  
    getData();
  }, []);



  useEffect(() => {
    const handleHashChange = () => {
      setUrl(location.hash.substring(1));
    };
  
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


return (
  <>
      <Header />
    <div className="container">
      <PageContext.Provider value={page}>
       {page.url === "/works" ? <Works data={data} /> : page.component}
    </PageContext.Provider>
    </div>
  </>
)

}

function Header() {
  const [activePage, setActivePage] = useState(location.hash || "#/");

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(location.hash || "#/");
      window.scrollTo(0, 0); // Sayfa yukarı kaymaz
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
   <>
      <nav className="navbar">
        <a href="#/" className={`nav-item ${activePage === "#/" ? "active" : ""}`}>
          <span className="icon">🏠</span>
          <span className="text">Home</span>
        </a>
        <a href="#/works" className={`nav-item ${activePage === "#/works" ? "active" : ""}`}>
          <span className="icon">💼</span>
          <span className="text">Works</span>
        </a>
        <a href="#/contact" className={`nav-item ${activePage === "#/contact" ? "active" : ""}`}>
          <span className="icon">📇</span>
          <span className="text">Contact</span>
        </a>
      </nav>
   </>
  );
}


function Home() {
  return (
<>
  <div className="home-page-container">
    <div className="profile-section">
      <img className="profil-photo" src="/img/profil.jpg" alt="Profil Fotoğrafı" />
      <img src="/img/arrow-icon.svg" alt="" />  
      <h2 className="name-tag">Ömer <br/>KULUÇ</h2> 
    </div>
    <div className="intro-text">
      Merhaba,  
      Portfolyo sayfama hoş geldiniz. Ben, yeni teknolojileri keşfetmeye meraklı ve tutkulu bir Jr. Front-End Developer'ım.  
      Web geliştirme dünyasındaki yolculuğum heyecan verici bir deneyim oldu ve her geçen gün kendimi daha da geliştirmeye çalışıyorum.  
    </div>
    <div className="change-page-options">
      <a href="#/works">Projelerim</a>
      <a href="#/contact">İletişim</a>
    </div>
  </div>
</>

  );
}

function Works({data}) {

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!isFirstLoad) return;

    const workCards = document.querySelectorAll(".work-card");

    // Kartları sırayla döndürerek açma efekti
    setTimeout(() => {
      workCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("flipped");
        }, index * 400);
      });
    }, 700);

    // Animasyonun tekrar çalışmasını önlemek için state güncelle
    setIsFirstLoad(false);
  }, [isFirstLoad]);



  if(!data) {
    return <div>Loading...</div>
  }

  return(
    <>

      <div className="work-cards">
        {data.map((x) => (
          <Work key={x.id} {...x} />
        ))}
      </div>
  </>
  )
}

function Work({title, image, liveLink, githubLink}) {
  return (
    <>
      <div className="work-card">
        <a href={liveLink} target="blank" rel="noopener noreferrer">
        <p>{title}</p>
        <img className="work-card-image" src={image} alt="" />
        </a>
        <a href={githubLink} target="blank" rel="noopener noreferrer">
          <button>
            Kodları Görüntüle
            <img src="" alt="" />
            </button> 
          </a>
        <a href={liveLink} target="blank" rel="noopener noreferrer">
          <button>Projeyi Görüntüle</button>
          </a>
      </div>
    </>
  )
}


function Contact() {
  return(
    <>
      <div className="contact-inner">
        <div className="contact-header">
          <h2>Contact</h2>
          <span></span>
        </div>
        <div className="contact-context">
        <div className="contact-text">
          <p>
          Her zaman yeni projeler, teknoloji dünyasındaki fırsatlar, iş birlikleri ve özellikle 
          mentorluk konularında konuşmaya açığım. Fikir alışverişinde bulunmak, birlikte üretmek 
          ve yeni ufuklar keşfetmek için iletişime geçmekten çekinmeyin! 🚀
          </p>
        </div>
        <div className="email-card">
          <a href="mailto:kuluc.omer@gmail.com">
          <img src="/img/email-icon.svg" alt="" />
          <p>kuluc.omer@gmail.com</p>
          </a>
        </div>
        <div className="alternative-card">
          <div className="github-area">
            <a href="https://github.com/omer-kuluc" target="blank">
              <span>Github :</span> 
              <img src="/img/github-icon.svg" alt="" />
            </a>
          </div>
          <div className="linkedin-area">
            <a href="https://www.linkedin.com/in/%C3%B6mer-kulu%C3%A7-8a03291b6/" target="blank">
              <span>Linkedin :</span> 
              <img src="/img/linkedin-icon.svg" alt="" />
            </a>
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
