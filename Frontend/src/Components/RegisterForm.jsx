import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/api";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      setMessage({ text: res.data.message, type: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Registration failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6)
      return { label: "Too short", color: "bg-red-500", width: "w-1/4" };
    if (pwd.length < 8)
      return { label: "Weak", color: "bg-orange-500", width: "w-2/4" };
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/))
      return { label: "Strong", color: "bg-green-500", width: "w-full" };
    return { label: "Medium", color: "bg-yellow-500", width: "w-3/4" };
  };

  const strength = passwordStrength(formData.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="text-gray-400 text-sm mb-1 block">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition"
        />
      </div>

      {/* Username */}
      <div>
        <label className="text-gray-400 text-sm mb-1 block">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          required
          minLength={3}
          className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition"
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-gray-400 text-sm mb-1 block">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 pr-10 text-sm outline-none transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password strength indicator */}
        {formData.password && strength && (
          <div className="mt-2">
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
              />
            </div>
            <p
              className={`text-xs mt-1 ${
                strength.label === "Strong"
                  ? "text-green-400"
                  : strength.label === "Medium"
                    ? "text-yellow-400"
                    : strength.label === "Weak"
                      ? "text-orange-400"
                      : "text-red-400"
              }`}
            >
              {strength.label}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-gray-400 text-sm mb-1 block">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`w-full bg-gray-800 border text-white rounded-xl px-4 py-3 pr-10 text-sm outline-none transition ${
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? "border-red-500 focus:border-red-500"
                : "border-gray-700 focus:border-blue-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
          )}
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`text-sm text-center py-2 px-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Login link */}
      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-400 hover:text-blue-300 font-medium transition"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
