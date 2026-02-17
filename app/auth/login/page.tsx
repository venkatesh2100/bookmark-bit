"use client";
import { supabase } from "@/lib/supabase/client";
// import { useRouter } from 'next/navigation'
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  // const router = useRouter()
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-center items-center justify-center">
      <div className="max-w-md w-full p-8  rounded-lg">
        <h1 className="text-xl  text-center font-bold mb-4">
          Bookmark Manager
        </h1>
        <p className="mb-6 text-gray-600 mask-radial-from-neutral-700 font-bold">
          Sign in with Google to continue
        </p>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2 px-4
             bg-white text-gray-700 border border-gray-300 rounded-lg
             shadow-sm hover:shadow-md hover:bg-gray-50
             disabled:opacity-50 transition"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            height={0}
            width={0}
            className="w-5 h-5"
          />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
