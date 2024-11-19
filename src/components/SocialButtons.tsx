import { useSignIn } from "@clerk/clerk-react";
import { Chrome } from "lucide-react";
import { useState } from "react";

export default function SocialButtons() {
  const { signIn, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    if (!isLoaded) return;
    
    try {
      setIsLoading(true);
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/dashboard`,
      });
    } catch (err) {
      console.error("Eroare la autentificarea cu Google:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      disabled={isLoading || !isLoaded}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Chrome className="h-5 w-5" />
      {isLoading ? "Se încarcă..." : "Continuă cu Google"}
    </button>
  );
} 