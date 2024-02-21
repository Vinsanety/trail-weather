import Navbar from "./ui/navbar";
import Footer from "./ui/footer";

export default function Home() {
  return (
    <div className="home-page flex flex-col h-screen">
      <Navbar />
      <main className="mb-auto"></main>
      <Footer />
    </div>
  );
}
