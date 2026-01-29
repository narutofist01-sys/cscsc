import { useEffect, useState } from "react";
import { useLocation, useSearch, useParams } from "wouter";
import { useDiscordCallback } from "@/hooks/use-auth";
import { CallbackState } from "@/components/CallbackState";

export default function CallbackPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const params = useParams<{ guildId?: string }>();
  const searchParams = new URLSearchParams(search);
  
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  
  const guildId = params.guildId || state;

  const { mutateAsync, isPending, isError, error: mutationError } = useDiscordCallback();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      return;
    }

    if (code) {
      // Pass both code and state (which contains the guildId)
      mutateAsync({ code, guildId: guildId || undefined, state: state || undefined })
        .then(() => {
          setSuccess(true);
        })
        .catch((err) => {
          console.error("Callback failed:", err);
        });
    }
  }, [code, error, guildId, state, mutateAsync]);

  // Determine current status
  const status = error || isError ? "error" : success ? "success" : "loading";
  
  // Determine message
  let message = "Verifying your identity...";
  if (status === "success") message = "You have been successfully authenticated.";
  if (status === "error") message = errorDescription || mutationError?.message || "Something went wrong during authorization.";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-10 md:p-14 rounded-3xl animate-enter">
        <CallbackState 
          status={status}
          message={message}
          errorDetails={isError ? mutationError?.message : undefined}
        />
      </div>
    </div>
  );
}
