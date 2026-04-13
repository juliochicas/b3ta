import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <MainHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
