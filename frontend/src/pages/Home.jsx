import HeroSection from "../components/home/HeroSection";
import TrustedCompanies from "../components/home/TrustedCompanies";
import PopularCities from "../components/home/PopularCities";
import FeaturedSpaces from "../components/home/FeaturedSpaces";
import CoworkingBrands from "../components/home/CoworkingBrands";
import HowItWorks from "../components/home/HowItWorks";
import WhyChooseUs from "../components/home/WhyChooseUs";
import MarketplaceStats from "../components/home/MarketplaceStats";
import Testimonials from "../components/home/Testimonials";
import CTASection from "../components/home/CTASection";
import FAQSection from "../components/home/FAQSection";
import HostCTA from "../components/home/HostCTA";
import Footer from "@/components/layout/Footer";

const Home = () => {
  return (
    <>
      <HeroSection />
      <TrustedCompanies />
      <PopularCities />
      <FeaturedSpaces />
      <CoworkingBrands />
      <HowItWorks />
      <WhyChooseUs />
      <MarketplaceStats />
      <Testimonials />
      <CTASection />
      <FAQSection />
      <HostCTA />
      <Footer />
    </>
  );
};

export default Home;
