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
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      <div className="navbar">
        <ul className="navbar-items">
          <li>
            <a href="#/" className={`nav-item ${activePage === "#/" ? "active" : ""}`}>
              <p className="text">Anasayfa</p>
            </a>
          </li>
          <li>
            <a href="#/about" className={`nav-item ${activePage === "#/about" ? "active" : ""}`}>
              <p className="text">Hakkımda</p>
            </a>
          </li>
          <li>
            <a href="#/works" className={`nav-item ${activePage === "#/works" ? "active" : ""}`}>
              <p className="text">Projelerim</p>
            </a>
          </li>
          <li>
            <a href="#/contact" className={`nav-item ${activePage === "#/contact" ? "active" : ""}`}>
              <p className="text">İletişim</p>
            </a>
          </li>
        </ul>
      </div>
    </>
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
          <div className="intro-text">
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
  useEffect(() => {
    const cards = document.querySelectorAll(".about-section > div");

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

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <h2 className="about-header">HAKKIMDA</h2>
      <div className="about-section">
        <div className="about-school-section">
          <h3>Bilgisayar Mühendisliği Mezunu ve Yazılım Temelleri</h3>
          <p>
            Bilgisayar mühendisliği mezunu olarak, yazılım geliştirme süreçlerine güçlü bir akademik temel
            ile adım attım. Eğitimim boyunca programlama prensipleri, problem çözme teknikleri ve yazılım
            geliştirme metodolojileri üzerine çalıştım. Kod yazarken sadece doğru çalışmasını değil, aynı
            zamanda verimli, okunabilir ve sürdürülebilir olmasını da ön planda tutuyorum. Yazılım mimarisi
            ve optimizasyon konularına duyduğum ilgi, geliştirdiğim projelerde performans ve ölçeklenebilirlik
            açısından en iyi uygulamaları benimsememi sağladı.
          </p>
        </div>
        <div className="about-course-section">
          <h3>Acunmedya Akademi'de Front-End Eğitimi</h3>
          <p>Acunmedya Akademi’de aldığım front-end eğitimiyle modern web teknolojilerine yönelik güçlü bir
            altyapı kazandım. HTML, CSS ve JavaScript kullanarak kullanıcı dostu ve estetik arayüzler oluşturma
            becerisi edindim. JavaScript'in asenkron yapısını, DOM manipülasyonunu ve state yönetimini etkin bir
            şekilde kullanarak dinamik web uygulamaları geliştirdim. React ile komponent bazlı mimariyi öğrenerek,
            yeniden kullanılabilir ve ölçeklenebilir arayüzler oluşturma konusunda deneyim kazandım. Ayrıca,
            API entegrasyonu ve veri yönetimi gibi konularda pratik projeler geliştirerek öğrendiklerimi gerçek
            dünya senaryolarına uygulama fırsatı buldum.</p>
        </div>
        <div className="about-front-end-section">
          <h3>Modern Web Teknolojilerine Tutkulu Bir Front-End Geliştirici</h3>
          <p>Teknolojiye olan ilgim ve yazılıma duyduğum merak, beni front-end geliştirme alanında uzmanlaşmaya
            yönlendirdi. Kullanıcı odaklı ve etkileşimli web uygulamaları geliştirmek, hem teknik becerilerimi
            kullanabileceğim hem de yaratıcı çözümler üretebileceğim bir alan sunuyor. HTML, CSS ve JavaScript’in
            yanı sıra React ile modern ve performanslı arayüzler oluşturma konusunda kendimi sürekli
            geliştiriyorum. Kodun sadece çalışmasını değil, aynı zamanda ölçeklenebilir, temiz ve sürdürülebilir
            olmasını önemsiyorum. Yeni teknolojileri keşfetmek, problem çözme yeteneğimi güçlendirmek ve etkili
            kullanıcı deneyimleri sunan projeler geliştirmek benim için bir tutkudan daha fazlası.</p>
        </div>
        <div className="about-future-section">
          <h3>Front-End Geliştirici Olarak Kariyer Hedefim</h3>
          <p>Yazılım dünyasında front-end geliştirici olarak kariyerime başlamayı hedefliyorum. Kullanıcı
            deneyimi odaklı, hızlı ve erişilebilir web arayüzleri geliştirmek benim için öncelikli bir konu.
            Yeni teknolojileri takip ederek kendimi sürekli geliştirmeye ve sektördeki en iyi uygulamaları
            projelerime entegre etmeye özen gösteriyorum. Takım çalışmasına yatkın, problem çözme yeteneği
            yüksek ve yaratıcı çözümler üreten bir yazılımcı olarak, yenilikçi projelerde yer almayı ve
            sektörde kalıcı bir iz bırakmayı amaçlıyorum.
          </p>
        </div>
      </div>
    </>
  )
}

function Works({ data }) {

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


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



  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <>

      <div className="work-cards">
        {data.map((x) => (
          <Work key={x.id} {...x} />
        ))}
      </div>
    </>
  )
}

function Work({ title, image, liveLink, githubLink }) {
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
  return (
    <>
      <div className="contact-inner">
        <h2>İLETİŞİM</h2>
        <div className="contact-content">
          <div className="contact-text">
            <p>
              Teknolojiye ve sürekli öğrenmeye olan ilgimle her zaman yeni projelere, yenilikçi
              fikirlere ve iş birliklerine açığım. Yazılım dünyasındaki gelişmeleri takip etmek,
              farklı bakış açılarıyla fikir alışverişinde bulunmak ve yaratıcı çözümler üretmek
              benim için büyük bir tutku. Özellikle front-end geliştirme, modern web teknolojileri
              ve kullanıcı deneyimi konularında paylaşım yapmayı, mentorluk vermeyi ve karşılıklı
              öğrenmeyi önemsiyorum.
              Eğer bir proje üzerinde iş birliği yapmak, teknik konular hakkında sohbet etmek veya
              mentorluk üzerine konuşmak isterseniz, bana her zaman ulaşabilirsiniz. Birlikte üretmek,
              yeni teknolojileri keşfetmek ve yazılım dünyasında güçlü bir ağ oluşturmak için
              iletişime geçmekten çekinmeyin! 🚀
            </p>
          </div>
          <div className="contact-info-area">
            <div onClick={() => (window.location.href = "mailto:kuluc.omer@gmail.com")} className="email-card">
              <img src="/img/email-icon.svg" alt="" />
              <p>kuluc.omer@gmail.com</p>
            </div>
            <div className="alternative-card">
              <div onClick={() => window.open("https://github.com/omer-kuluc", "_blank")}
                className="github-area">
                <span>Github :</span>
                <img src="/img/github-icon.svg" alt="" />
              </div>
              <div onClick={() => window.open("https://www.linkedin.com/in/%C3%B6mer-kulu%C3%A7-8a03291b6/", "_blank")}
                className="linkedin-area">
                <span>Linkedin :</span>
                <img src="/img/linkedin-icon.svg" alt="" />
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
