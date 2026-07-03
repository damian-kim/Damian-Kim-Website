import Header from './components/Header';
import Hero from './components/Hero';
import PhysicsSandbox from './components/PhysicsSandbox';
import Experience from './components/Experience';
import Projects from './components/Projects';
import EducationSkills from './components/EducationSkills';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PhysicsSandbox />
        <Experience />
        <Projects />
        <EducationSkills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
