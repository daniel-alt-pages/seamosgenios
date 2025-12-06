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

      <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© 2026 PreICFES Seamos Genios. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
