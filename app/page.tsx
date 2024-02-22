import Navbar from "./ui/navbar";
import Footer from "./ui/footer";
import CitySearch from "./ui/city-search";
export default function Home() {
  return (
    <div className="home-page flex flex-col h-screen">
      <Navbar />
      <main className="mb-auto">
        <CitySearch />
      </main>
      <Footer />
    </div>
  );
}
