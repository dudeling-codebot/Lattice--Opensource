import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Individuals from './components/Individuals.jsx';
import Enterprise from './components/Enterprise.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Pricing from './components/Pricing.jsx';
import Contact from './components/Contact.jsx';
import ContactPage from './pages/ContactPage.jsx';

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Individuals />
        <Enterprise />
        <HowItWorks />
        <Pricing />
        <Contact />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}