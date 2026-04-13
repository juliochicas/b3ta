import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-teal-700 focus:font-semibold"
      >
        Ir al contenido principal
      </a>
      <MainHeader />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
