import { useNavigate } from "react-router-dom";
import RegisterForm from "../Components/RegisterForm";
import { Shield, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a2744_1px,transparent_1px),linear-gradient(to_bottom,#1a2744_1px,transparent_1px)] bg-size[60px_60px] opacity-10" />

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
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1">
              Join CyberLens and start securing your assets
            </p>
          </div>

          <RegisterForm />
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 CyberLens. Built for security research and education.
        </p>
      </div>
    </div>
  );
}
