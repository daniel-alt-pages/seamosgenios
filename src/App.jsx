import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseTimeline from './components/CourseTimeline';
import Pricing from './components/Pricing';
import Ranking from './components/Ranking';
import Tutors from './components/Tutors';
import About from './components/About';

function App() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-red-500/30">
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
