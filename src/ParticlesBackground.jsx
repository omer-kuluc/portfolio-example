import { useCallback } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async () => { }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: false }, // 👈 fullscreen kapatıldı
        background: {
          color: {
            value: "transparent", // 👈 background'ı tamamen şeffaf yaptık
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        particles: {
          color: { value: "#ffffff" },
          links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.3, width: 1 },
          collisions: { enable: true },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            speed: 1,
          },
          number: { value: 40, density: { enable: true, area: 800 } },
          opacity: { value: 0.3 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 5 } },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 0, // 👈 en arkada durması için
        top: 0,
        left: 0,
        pointerEvents: "none", // 👈 tıklamayı engellemesin
      }}
    />
  );
};

export default ParticlesBackground;
