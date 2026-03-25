import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Search,
  Zap,
  Globe,
  Map,
  Lock,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

const tools = [
  {
    icon: "🔍",
    name: "Nmap",
    color: "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60",
    iconBg: "bg-blue-500/20",
    desc: "Discover open ports, running services and OS fingerprinting across your network infrastructure.",
    tags: ["Port Scanning", "Service Detection", "OS Detection"],
  },
  {
    icon: "⚡",
    name: "Nuclei",
    color: "border-purple-500/30 bg-purple-500/5 hover:border-purple-500/60",
    iconBg: "bg-purple-500/20",
    desc: "Scan for 9000+ vulnerabilities using community-powered templates with CVE correlation.",
    tags: ["CVE Detection", "CVSS Scoring", "9000+ Templates"],
  },
  {
    icon: "🕷️",
    name: "Nikto",
    color: "border-orange-500/30 bg-orange-500/5 hover:border-orange-500/60",
    iconBg: "bg-orange-500/20",
    desc: "Identify web server misconfigurations, outdated software and security header issues.",
    tags: ["Web Server", "Misconfigs", "Headers"],
  },
  {
    icon: "🌐",
    name: "WhatWeb",
    color: "border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-500/60",
    iconBg: "bg-cyan-500/20",
    desc: "Fingerprint web technologies, frameworks, CMS platforms and server software versions.",
    tags: ["Tech Stack", "CMS Detection", "Fingerprinting"],
  },
  {
    icon: "🗺️",
    name: "Subfinder",
    color: "border-green-500/30 bg-green-500/5 hover:border-green-500/60",
    iconBg: "bg-green-500/20",
    desc: "Enumerate subdomains passively to map your attack surface and discover hidden assets.",
    tags: ["Subdomain Discovery", "Recon", "Attack Surface"],
  },
  {
    icon: "🔒",
    name: "SSLyze",
    color: "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/60",
    iconBg: "bg-yellow-500/20",
    desc: "Analyze SSL/TLS configurations, detect weak ciphers, expired certificates and vulnerabilities.",
    tags: ["SSL/TLS", "Certificates", "Cipher Analysis"],
  },
];

const steps = [
  {
    step: "01",
    title: "Add Your Target",
    desc: "Add any IP address, domain or web application you want to assess. Verify connectivity with a single click.",
    icon: "🎯",
  },
  {
    step: "02",
    title: "Choose Your Tool",
    desc: "Select from 6 professional security tools depending on what you want to discover — ports, vulns, SSL or subdomains.",
    icon: "🛠️",
  },
  {
    step: "03",
    title: "Run the Scan",
    desc: "Scans run automatically in the background. Get real-time status updates while the engine works.",
    icon: "⚡",
  },
  {
    step: "04",
    title: "Analyze Results",
    desc: "View detailed findings with CVE IDs, CVSS scores and risk levels. Export professional PDF reports.",
    icon: "📊",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    if (token) {
      setIsLoggedIn(true);
      setUsername(user || "User");
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="bg-[#0a0f1e] text-white min-h-screen">
      {/* ---- NAVBAR ---- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0f1e]/95 backdrop-blur-md border-b border-gray-800"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">CyberLens</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-white transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:text-white transition"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection("tools")}
              className="hover:text-white transition"
            >
              Tools
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="hover:text-white transition"
            >
              Contact
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0f172a] border-t border-gray-800 px-6 py-4 space-y-4">
            <button
              onClick={() => scrollToSection("features")}
              className="block text-gray-400 hover:text-white text-sm"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block text-gray-400 hover:text-white text-sm"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection("tools")}
              className="block text-gray-400 hover:text-white text-sm"
            >
              Tools
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="block text-gray-400 hover:text-white text-sm"
            >
              Contact
            </button>
            <div className="flex gap-3 pt-2">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-full justify-center"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex-1 border border-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ---- HERO SECTION ---- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a2744_1px,transparent_1px),linear-gradient(to_bottom,#1a2744_1px,transparent_1px)] bg-size-[60px_60px] opacity-20" />

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

        <div className="relative text-center max-w-4xl mx-auto pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-sm mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            AI-Powered Vulnerability Assessment Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Secure Your
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Digital Assets
            </span>
            with Precision
          </h1>

          {/* Subheadline */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            CyberLens combines 6 professional security tools into one unified
            platform. Scan, analyze and remediate vulnerabilities with
            AI-assisted insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold transition"
              >
                <LayoutDashboard size={20} />
                Go to Dashboard
                <ChevronRight size={18} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold transition"
                >
                  Get Started Free
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-base font-semibold transition"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 text-gray-600 text-sm">
            <span>Scroll to explore</span>
            <div className="w-5 h-8 border border-gray-600 rounded-full flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- FEATURES SECTION ---- */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block text-blue-400">Stay Secure</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A complete vulnerability assessment suite built for security
              professionals and researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🤖",
                title: "AI-Powered Analysis",
                desc: "Get instant explanations and remediation advice from our built-in AI chatbot powered by Llama 3.3.",
                color: "text-blue-400",
              },
              {
                icon: "📄",
                title: "PDF Report Export",
                desc: "Generate professional vulnerability reports with one click. Perfect for clients and compliance.",
                color: "text-purple-400",
              },
              {
                icon: "🔴",
                title: "CVE Integration",
                desc: "Automatically correlate findings with CVE database. Get CVSS scores and severity ratings.",
                color: "text-red-400",
              },
              {
                icon: "⚠️",
                title: "Risk Scoring",
                desc: "Each target gets an automatic risk score based on vulnerability severity counts.",
                color: "text-orange-400",
              },
              {
                icon: "👤",
                title: "Multi-User Support",
                desc: "Secure per-user data isolation. Each account only sees their own assets and scans.",
                color: "text-green-400",
              },
              {
                icon: "📊",
                title: "Live Dashboard",
                desc: "Real-time charts showing vulnerability distribution, scan history and risk trends.",
                color: "text-cyan-400",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className={`text-lg font-semibold mb-2 ${f.color}`}>
                  {f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- TOOLS SECTION ---- */}
      <section id="tools" className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              6 Professional
              <span className="block text-blue-400">Security Tools</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Industry-standard tools integrated into one seamless platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <div
                key={i}
                className={`border rounded-2xl p-6 transition cursor-default ${tool.color}`}
              >
                <div
                  className={`w-12 h-12 ${tool.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}
                >
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {tool.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-lg border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- HOW IT WORKS SECTION ---- */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It
              <span className="text-blue-400"> Works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get from zero to a complete vulnerability assessment in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-linear-to-r from-blue-500/50 to-transparent z-10" />
                )}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition">
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <div className="text-blue-400 text-xs font-bold mb-2 font-mono">
                    STEP {step.step}
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA SECTION ---- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 border border-blue-500/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to Secure
              <span className="block text-blue-400">Your Infrastructure?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join CyberLens today and start identifying vulnerabilities before
              attackers do.
            </p>
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold transition mx-auto"
              >
                <LayoutDashboard size={20} />
                Go to Dashboard
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-semibold transition"
                >
                  Create Free Account
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-base font-semibold transition"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold">CyberLens</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 CyberLens. Built for security research and education.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-white transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("tools")}
              className="hover:text-white transition"
            >
              Tools
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:text-white transition"
            >
              How it Works
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="hover:text-white transition"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
