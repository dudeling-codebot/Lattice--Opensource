import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Individuals from './components/Individuals.jsx';
import Enterprise from './components/Enterprise.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Pricing from './components/Pricing.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Individuals />
        <Enterprise />
        <HowItWorks />
        <Pricing />
        <Contact />
      </main>
    </div>
  );
}