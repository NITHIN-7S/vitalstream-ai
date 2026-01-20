import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X, User, Stethoscope, ClipboardList } from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass shadow-card"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <Activity className="h-8 w-8 text-primary" />
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold text-foreground">
                Health<span className="text-primary">Pulse</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth/doctor">
              <Button variant="ghost" size="sm" className="gap-2">
                <Stethoscope className="h-4 w-4" />
                Doctor
              </Button>
            </Link>
            <Link to="/auth/receptionist">
              <Button variant="outline" size="sm" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                Reception
              </Button>
            </Link>
            <Link to="/auth/patient">
              <Button variant="hero" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Patient
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block py-2 text-sm font-medium ${
                    isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link to="/auth/doctor" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Doctor Portal
                  </Button>
                </Link>
                <Link to="/auth/receptionist" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Reception Portal
                  </Button>
                </Link>
                <Link to="/auth/patient" onClick={() => setIsOpen(false)}>
                  <Button variant="hero" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Patient Portal
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;