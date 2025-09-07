import HeroSection from "@/components/home/HeroSection";
import FeaturedMenu from "@/components/home/FeaturedMenu";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import LocationHours from "@/components/home/LocationHours";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturedMenu />
      <WhyChooseUs />
      <LocationHours />
      <section className="py-20 solis-gradient">
        <div className="container mx-auto px-6 text-center text-white max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for the Perfect Cup?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join our community of coffee lovers and discover your new favorite blend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/menu" className="px-6 py-3 rounded-lg bg-solis-gold text-navy font-semibold hover-lift">View Our Menu</a>
            <a href="/contact" className="px-6 py-3 rounded-lg border border-white text-white hover:bg-white hover:text-navy hover-lift">Visit Us Today</a>
          </div>
        </div>
      </section>
    </div>
  );
}
