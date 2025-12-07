import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseTimeline from './components/CourseTimeline';
import Pricing from './components/Pricing';
import Ranking from './components/Ranking';
import Tutors from './components/Tutors';
import About from './components/About';

import RotateDevicePrompt from './components/RotateDevicePrompt';

function App() {
  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['precios', 'cronograma', 'ranking', 'tutores', 'nosotros'];
      let currentSection = '';

      // Check which section is most visible in the viewport
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Logic: If the top of the section is within the top half of the viewport
          // OR if the section covers a significant portion of the viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = sectionId;
            break;
          }
        }
      }

      // Update URL hash without jumping
      if (currentSection && window.location.hash !== `#${currentSection}`) {
        // Using replaceState prevents filling up the browser history
        window.history.replaceState(null, null, `#${currentSection}`);
      } else if (!currentSection && window.scrollY < 100) {
        // Remove hash if at very top (Hero)
        if (window.location.hash) {
          window.history.replaceState(null, null, ' ');
        }
      }
    };

    // Throttle scroll event slightly for performance
    let timeoutId = null;
    const throttledScroll = () => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledScroll);
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  return (
    <div className="min-h-screen bg-background text-white selection:bg-red-500/30">
      <RotateDevicePrompt />
      <Navbar />
      <Hero />
      <Pricing />
      <CourseTimeline />
      <Ranking />
      <Tutors />
      <About />

      <footer className="py-12 border-t border-white/10 bg-black/20 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <p className="text-gray-500 text-sm">© 2026 PreICFES Seamos Genios.</p>
            <p className="text-gray-600 text-xs">Todos los derechos reservados.</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <a
              href="https://wa.me/573042359048"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white text-sm font-medium transition-all hover:scale-105 group"
            >
              <MessageCircle size={16} className="text-gray-400 group-hover:text-white transition-colors" />
              <span>Contactar Developer</span>
            </a>
            <p className="text-gray-600 text-xs">
              Página diseñada por <span className="text-gray-400 font-bold hover:text-white transition-colors cursor-default">Daniel de la Cruz</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
