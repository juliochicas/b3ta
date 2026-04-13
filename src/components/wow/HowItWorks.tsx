import { FileSpreadsheet, ArrowRight, Monitor, MessageCircle, Bell, Smartphone } from "lucide-react";

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Asi se ve el cambio
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            De hacerlo todo manual a tenerlo todo conectado.
          </p>
        </div>

        {/* Before → After visual */}
        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center mb-16">

          {/* ANTES */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">Hoy</p>
            <div className="space-y-3">
              {[
                { icon: FileSpreadsheet, text: "Cotizas en Excel" },
                { icon: MessageCircle, text: "Mandas WhatsApp uno por uno" },
                { icon: FileSpreadsheet, text: "Copias datos a mano" },
                { icon: Smartphone, text: "El cliente te llama para todo" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-red-100">
                  <item.icon className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="hidden md:flex w-16 h-16 rounded-full bg-amber-400 items-center justify-center">
              <ArrowRight className="w-7 h-7 text-slate-900" />
            </div>
            <div className="md:hidden flex items-center justify-center py-2">
              <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center rotate-90">
                <ArrowRight className="w-6 h-6 text-slate-900" />
              </div>
            </div>
          </div>

          {/* DESPUES */}
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-6">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-4">Con B3TA</p>
            <div className="space-y-3">
              {[
                { icon: Monitor, text: "Cotizas desde tu celular en tu sistema" },
                { icon: Bell, text: "WhatsApp avisa automatico al cliente" },
                { icon: Monitor, text: "Los datos se llenan solos" },
                { icon: Smartphone, text: "El cliente ve todo en su portal" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-teal-100">
                  <item.icon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 simple examples */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "Pagina Web",
              before: "Nadie te encuentra",
              after: "Sales en Google, te ven profesional",
              emoji: "🌐",
            },
            {
              title: "Sistema Propio",
              before: "Excel, Word, papeles",
              after: "Cotizas desde el celular, PDF automatico",
              emoji: "📱",
            },
            {
              title: "Automatizacion",
              before: "Mandas todo manual",
              after: "El sistema avisa, factura y notifica solo",
              emoji: "⚡",
            },
          ].map((ex, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-6 border border-gray-100">
              <div className="text-3xl mb-3">{ex.emoji}</div>
              <h3 className="text-base font-bold text-slate-900 mb-3">{ex.title}</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-red-400 mt-0.5 flex-shrink-0">ANTES</span>
                  <span className="text-sm text-slate-500">{ex.before}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-teal-600 mt-0.5 flex-shrink-0">AHORA</span>
                  <span className="text-sm text-slate-700 font-medium">{ex.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
