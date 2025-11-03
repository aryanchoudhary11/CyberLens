import RegisterForm from "../Components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Create an Account
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Join CyberLens and get started
        </p>

        <RegisterForm />
      </div>
    </div>
  );
}
