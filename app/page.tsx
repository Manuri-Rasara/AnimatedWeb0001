import App from "@/components/App";
import CircularGallery from "../components/CircularGallery"

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <App />
<section
  className="relative w-full h-[100vh] overflow-hidden pointer-events-auto z-10"
  style={{ transform: "scale(0.9)", transformOrigin: "center" }}
>        <CircularGallery />
      </section>
    </main>
  );
}
