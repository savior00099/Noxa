import Hero from "@/components/hero/Hero";
import ColorwaysSection from "@/components/sections/ColorwaysSection";
import DetailSection from "@/components/sections/DetailSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CTASection from "@/components/sections/CTASection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-black">
      <Hero />
      <ColorwaysSection />
      <DetailSection />
      <FeaturesSection />
      <CTASection />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
