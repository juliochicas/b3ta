import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface StatItem {
  value: string;
  numericEnd: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
}

const stats: StatItem[] = [
  {
    value: "50+",
    numericEnd: 50,
    suffix: "+",
    label: "Proyectos Entregados",
    sublabel: "En Guatemala, Mexico, Colombia y mas"
  },
  {
    value: "12",
    numericEnd: 12,
    suffix: "",
    label: "Paises en LATAM",
    sublabel: "Donde operan nuestros clientes"
  },
  {
    value: "5",
    numericEnd: 5,
    suffix: "+",
    label: "Anos de Experiencia",
    sublabel: "Desde 2020 integrando sistemas"
  }
];

const AnimatedCounter = ({
  end,
  suffix,
  prefix = "",
  duration = 2000,
  active
}: {
  end: number;
  suffix: string;
  prefix?: string;
  duration?: number;
  active: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * (end - startValue) + startValue));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };

    requestAnimationFrame(step);
  }, [active, end, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
};

export const StatsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-card relative overflow-hidden">

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            En Numeros
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            Lo que hemos{" "}
            <span className="text-secondary">construido</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="p-8 rounded-xl bg-card border border-border/50 hover:border-primary/40 transition-all duration-200 text-center"
            >
              <div>
                <div className="text-6xl md:text-7xl font-black mb-4 text-primary leading-none">
                  <AnimatedCounter
                    end={stat.numericEnd}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    active={inView}
                    duration={1800}
                  />
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
                <p className="text-lg font-bold text-foreground mb-1">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
