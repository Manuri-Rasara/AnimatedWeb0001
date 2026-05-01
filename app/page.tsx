import App from "@/components/App";
import CircularGallery from "../components/CircularGallery"

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <App />
      <section className="relative w-full h-[100vh] bg-black overflow-hidden pointer-events-auto z-10">
        <CircularGallery />
      </section>
    </main>
  );
}
