import RegisterForm from "../Components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
      <h2 className="text-2xl font-semibold text-center text-white mb-6">
        Create an Account
      </h2>
      <RegisterForm />
    </div>
  );
}
