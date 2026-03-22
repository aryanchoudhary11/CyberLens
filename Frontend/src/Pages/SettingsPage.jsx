import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import api from "../api/api";
import Sidebar from "../Components/Sidebar";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Username form
  const [username, setUsername] = useState("");
  const [usernameMsg, setUsernameMsg] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
      setUsername(res.data.username);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setUsernameLoading(true);
    setUsernameMsg(null);
    try {
      const res = await api.put("/auth/update-username", { username });
      // Update token and username in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);
      setUser(res.data.user);
      setUsernameMsg({
        type: "success",
        text: "Username updated successfully!",
      });
    } catch (err) {
      setUsernameMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update username",
      });
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      await api.put("/auth/change-password", passwords);
      setPasswordMsg({
        type: "success",
        text: "Password changed successfully!",
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.username) return;
    setDeleteLoading(true);
    try {
      await api.delete("/auth/delete-account");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    { id: "password", label: "Password", icon: <Lock size={16} /> },
    { id: "danger", label: "Danger Zone", icon: <Trash2 size={16} /> },
  ];

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-white items-start">
      <Sidebar />

      <div className="flex-1 p-8 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-2">Settings</h1>
        <p className="text-gray-400 text-sm mb-8">
          Manage your account settings
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === tab.id
                  ? tab.id === "danger"
                    ? "border-red-500 text-red-400"
                    : "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ---- PROFILE TAB ---- */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    {user?.username}
                  </p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Member since{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Read-only email */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-1 block">
                  Email Address
                </label>
                <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-400 text-sm">
                  {user?.email}
                </div>
                <p className="text-gray-600 text-xs mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>

            {/* Update Username */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Change Username</h2>
              <form onSubmit={handleUpdateUsername} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    New Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition"
                  />
                </div>

                {usernameMsg && (
                  <p
                    className={`text-sm ${usernameMsg.type === "success" ? "text-green-400" : "text-red-400"}`}
                  >
                    {usernameMsg.type === "success" ? "✅" : "❌"}{" "}
                    {usernameMsg.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={usernameLoading || username === user?.username}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
                >
                  <Save size={15} />
                  {usernameLoading ? "Saving..." : "Save Username"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---- PASSWORD TAB ---- */}
        {activeTab === "password" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    placeholder="Enter current password"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 pr-10 text-sm outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                  >
                    {showPasswords.current ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 pr-10 text-sm outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                      })
                    }
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    placeholder="Repeat new password"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 pr-10 text-sm outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {passwordMsg && (
                <p
                  className={`text-sm ${passwordMsg.type === "success" ? "text-green-400" : "text-red-400"}`}
                >
                  {passwordMsg.type === "success" ? "✅" : "❌"}{" "}
                  {passwordMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
              >
                <Lock size={15} />
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        )}

        {/* ---- DANGER ZONE TAB ---- */}
        {activeTab === "danger" && (
          <div className="bg-gray-900 border border-red-900/40 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={20} className="text-red-400" />
              <h2 className="text-lg font-semibold text-red-400">
                Danger Zone
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Once you delete your account, all your targets, scans and
              vulnerabilities will be permanently deleted. This action cannot be
              undone.
            </p>

            <button
              onClick={() => setDeleteModal(true)}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 text-red-400 px-5 py-2.5 rounded-xl text-sm font-medium transition"
            >
              <Trash2 size={15} />
              Delete My Account
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={20} className="text-red-400" />
              <h2 className="text-lg font-semibold text-white">
                Delete Account
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              This will permanently delete your account and all associated data.
              This action{" "}
              <strong className="text-white">cannot be undone</strong>.
            </p>
            <p className="text-gray-400 text-sm mb-2">
              Type{" "}
              <span className="text-white font-mono font-bold">
                {user?.username}
              </span>{" "}
              to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={user?.username}
              className="w-full bg-gray-800 border border-gray-700 focus:border-red-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== user?.username || deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
