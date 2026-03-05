import { motion } from "framer-motion";

interface ECGWaveProps {
  className?: string;
  color?: string;
  speed?: number;
}

const ECGWave = ({ className = "", color = "hsl(var(--primary))", speed = 2 }: ECGWaveProps) => {
  // More realistic ECG waveform with P-wave, QRS complex, T-wave pattern
  const pathData = "M0,50 L15,50 Q18,50 20,48 Q22,46 24,50 L28,50 L30,50 L32,15 L34,75 L36,30 L38,50 L42,50 Q45,50 47,44 Q50,38 52,44 Q54,50 56,50 L70,50 L85,50 Q88,50 90,48 Q92,46 94,50 L98,50 L100,50 L102,15 L104,75 L106,30 L108,50 L112,50 Q115,50 117,44 Q120,38 122,44 Q124,50 126,50 L140,50 L155,50 Q158,50 160,48 Q162,46 164,50 L168,50 L170,50 L172,15 L174,75 L176,30 L178,50 L182,50 Q185,50 187,44 Q190,38 192,44 Q194,50 196,50 L210,50 L225,50 Q228,50 230,48 Q232,46 234,50 L238,50 L240,50 L242,15 L244,75 L246,30 L248,50 L252,50 Q255,50 257,44 Q260,38 262,44 Q264,50 266,50 L280,50 L295,50 Q298,50 300,48 Q302,46 304,50 L308,50 L310,50 L312,15 L314,75 L316,30 L318,50 L322,50 Q325,50 327,44 Q330,38 332,44 Q334,50 336,50 L350,50";

  return (
    <div className={`overflow-hidden relative ${className}`}>
      {/* Glow effect behind the wave */}
      <motion.svg
        viewBox="0 0 175 100"
        className="w-[200%] h-full absolute inset-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.15}
          filter="blur(4px)"
        />
      </motion.svg>

      {/* Main ECG line */}
      <motion.svg
        viewBox="0 0 175 100"
        className="w-[200%] h-full relative z-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bright leading dot */}
      </motion.svg>

      {/* Scanning line overlay */}
      <motion.div
        className="absolute top-0 bottom-0 w-8 z-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}22, transparent)`,
        }}
        animate={{ left: ["-5%", "105%"] }}
        transition={{
          duration: speed * 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Grid lines */}
      <svg viewBox="0 0 175 100" className="absolute inset-0 w-full h-full opacity-[0.06]">
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke={color} strokeWidth="0.5" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 10} x2="175" y2={i * 10} stroke={color} strokeWidth="0.5" />
        ))}
      </svg>
    </div>
  );
};

export default ECGWave;
