import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  Mail,
  MessageSquare,
  Bug,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const faqs = [
  {
    question: "What tools does CyberLens support?",
    answer:
      "CyberLens integrates 6 professional security tools: Nmap (port scanning), Nuclei (vulnerability scanning), Nikto (web server scanning), WhatWeb (technology fingerprinting), Subfinder (subdomain discovery), and SSLyze (SSL/TLS analysis).",
  },
  {
    question: "Is my scan data private?",
    answer:
      "Yes. CyberLens uses per-user data isolation — each account can only see their own targets, scans and vulnerabilities. No data is shared between users.",
  },
  {
    question: "How is the risk score calculated?",
    answer:
      "Risk score is calculated using vulnerability severity weights: Critical×10 + High×7 + Medium×4 + Low×1. The score maps to levels: None (0), Low (1-20), Medium (21-50), High (51-100), Critical (100+).",
  },
  {
    question: "Can I export scan results?",
    answer:
      "Yes! Every completed scan has a Download PDF button that generates a professional vulnerability report including scan details, findings, severity breakdown and CVE information.",
  },
  {
    question: "What is CVE lookup integration?",
    answer:
      "When Nuclei or Nikto detects a vulnerability with a CVE ID, CyberLens automatically fetches details from the CVE database including CVSS score, description and references.",
  },
  {
    question: "How does the AI chatbot work?",
    answer:
      "The AI chatbot is powered by Llama 3.3 via Groq API. It can explain vulnerabilities from your scans, provide remediation steps, answer general security questions and help analyze your results.",
  },
];

export default function ContactSupport() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const scrollToForm = (subject) => {
    setForm((prev) => ({ ...prev, subject }));
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFaq = () => {
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[#0a0f1e]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">CyberLens</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact &<span className="text-blue-400"> Support</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Have a question or found a bug? We're here to help.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Email Support */}
          <a
            href="mailto:support@cyberlens.io"
            className="border rounded-2xl p-6 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50 transition cursor-pointer block"
          >
            <div className="mb-3 text-blue-400">
              <Mail size={24} />
            </div>
            <h3 className="text-white font-semibold mb-2">Email Support</h3>
            <p className="text-gray-400 text-sm mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <span className="text-sm font-medium text-blue-400 hover:underline">
              support@cyberlens.io →
            </span>
          </a>

          {/* Report Bug */}
          <div
            onClick={() => scrollToForm("bug")}
            className="border rounded-2xl p-6 bg-red-500/10 border-red-500/20 hover:border-red-500/50 transition cursor-pointer"
          >
            <div className="mb-3 text-red-400">
              <Bug size={24} />
            </div>
            <h3 className="text-white font-semibold mb-2">Report a Bug</h3>
            <p className="text-gray-400 text-sm mb-4">
              Found an issue? Let us know and help us improve CyberLens.
            </p>
            <span className="text-sm font-medium text-red-400 hover:underline">
              Report Bug →
            </span>
          </div>

          {/* View Docs */}
          <div
            onClick={scrollToFaq}
            className="border rounded-2xl p-6 bg-green-500/10 border-green-500/20 hover:border-green-500/50 transition cursor-pointer"
          >
            <div className="mb-3 text-green-400">
              <HelpCircle size={24} />
            </div>
            <h3 className="text-white font-semibold mb-2">Documentation</h3>
            <p className="text-gray-400 text-sm mb-4">
              Browse our docs for guides on using all 6 scanning tools.
            </p>
            <span className="text-sm font-medium text-green-400 hover:underline">
              View Docs →
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div id="contact-form">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

            {submitted ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      email: "",
                      subject: "general",
                      message: "",
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                      className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                      className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition"
                  >
                    <option value="general">General Question</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="scan">Scan Issue</option>
                    <option value="account">Account Problem</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Message
                  </label>
                  <textarea
                    placeholder="Describe your issue or question in detail..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                    rows={5}
                    className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* FAQ Section */}
          <div id="faq">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/50 transition"
                  >
                    <span className="text-sm font-medium text-white">
                      {faq.question}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp size={16} className="text-blue-400 shrink-0" />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-gray-400 shrink-0"
                      />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4">
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © 2026 CyberLens. Built for security research and education.
        </div>
      </footer>
    </div>
  );
}
