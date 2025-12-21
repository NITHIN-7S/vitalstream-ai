import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors overflow-hidden group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity ${
          isDark ? "bg-blue-400/30" : "bg-yellow-400/30"
        }`}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative"
          >
            <Moon className="h-5 w-5 text-blue-300" />
            {/* Stars animation */}
            <motion.div
              className="absolute -top-1 -right-1 w-1 h-1 bg-blue-200 rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-0.5 -left-1 w-0.5 h-0.5 bg-blue-200 rounded-full"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sun className="h-5 w-5 text-yellow-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
