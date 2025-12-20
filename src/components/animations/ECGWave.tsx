import { motion } from "framer-motion";

interface ECGWaveProps {
  className?: string;
  color?: string;
  speed?: number;
}

const ECGWave = ({ className = "", color = "hsl(var(--primary))", speed = 2 }: ECGWaveProps) => {
  const pathData = "M0,50 L20,50 L25,50 L30,20 L35,80 L40,50 L45,50 L50,50 L55,50 L60,35 L65,65 L70,50 L80,50 L85,50 L90,15 L95,85 L100,50 L105,50 L120,50 L125,50 L130,20 L135,80 L140,50 L145,50 L150,50 L155,50 L160,35 L165,65 L170,50 L180,50 L185,50 L190,15 L195,85 L200,50 L205,50 L220,50 L225,50 L230,20 L235,80 L240,50 L245,50 L250,50 L255,50 L260,35 L265,65 L270,50 L280,50 L285,50 L290,15 L295,85 L300,50 L305,50 L320,50";

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.svg
        viewBox="0 0 160 100"
        className="w-[200%] h-full"
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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
};

export default ECGWave;
