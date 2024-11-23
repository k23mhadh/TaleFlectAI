import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import FeatureSection from "./components/FeatureSection"
import PricingSection from "./components/PricingSection"
import Footer from "./components/Footer"
import LoginModal from "./components/LoginModal"

function App() {

  return (
    <>
      <Navbar />
      <LoginModal />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
        <FeatureSection />
        <PricingSection />
        <Footer />
      </div>
    </>
  )
}

export default App
