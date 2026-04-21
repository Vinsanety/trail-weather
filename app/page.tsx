import Navbar from "./ui/navbar";
import Footer from "./ui/footer";
import CitySearch from "./ui/city-search";

export default function Home() {
  return (
    <div className="home-page flex min-h-screen flex-col">
      <Navbar />
      <main className="mb-auto px-4 py-6 md:px-10 md:py-10 lg:px-12">
        <CitySearch />
      </main>
      <Footer />
    </div>
  );
}
