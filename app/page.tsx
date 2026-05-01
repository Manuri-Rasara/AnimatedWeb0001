import App from "@/components/App";
import CircularGallery from "../components/CircularGallery"


export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <App />
      <section >
       

<div style={{ height: '600px', position: 'relative' }}>
  <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}
  bend={3}
  borderRadius={0.05}
  scrollSpeed={2}
  scrollEase={0.05}
/>
</div>
      </section>

    
    </main>
  );
}
