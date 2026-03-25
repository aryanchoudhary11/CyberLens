import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../Components/LoginForm";
import { Shield, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a2744_1px,transparent_1px),linear-gradient(to_bottom,#1a2744_1px,transparent_1px)] bg-size-[60px_60px] opacity-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Back to home */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-800">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
              <Shield size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {showForgotPassword ? "Reset Password" : "Welcome Back"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {showForgotPassword
                ? "Enter your email to reset your password"
                : "Sign in to your CyberLens account"}
            </p>
          </div>

          {/* Forgot Password View */}
          {showForgotPassword ? (
            <div>
              {submitted ? (
                <div className="text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-white font-semibold mb-2">
                    Check your email
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    If an account exists for{" "}
                    <span className="text-white">{email}</span>, you'll receive
                    a password reset link shortly.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setSubmitted(false);
                      setEmail("");
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm transition"
                  >
                    ← Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition"
                  >
                    Send Reset Link
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-gray-400 hover:text-white text-sm transition flex items-center justify-center gap-1"
                  >
                    <ArrowLeft size={14} />
                    Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              {/* Login Form */}
              <LoginForm />

              {/* Forgot Password Link */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-gray-400 hover:text-blue-400 text-sm transition"
                >
                  Forgot your password?
                </button>
              </div>
              <p className="text-center text-sm text-gray-400 mt-3">
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Register here.
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 CyberLens. Built for security research and education.
        </p>
      </div>
    </div>
  );
}
