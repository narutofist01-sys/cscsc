import { DiscordButton } from "@/components/DiscordButton";
import { motion } from "framer-motion";

export default function Home() {
  // This would typically come from an API or env var
  // Using a placeholder URL structure for now as per instructions
  // In a real app, this should be the full OAuth2 URL
  const handleLogin = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID || '1432631501354434690';
    const scopes = ["identify", "guilds", "guilds.join"];
    
    // Check for guild_id in URL or from state management
    const searchParams = new URLSearchParams(window.location.search);
    const guildId = searchParams.get("guild_id") || "1346467864143462430";

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: window.location.origin + '/callback',
      response_type: "code",
      scope: scopes.join(" "),
      state: guildId, // Pass guild ID in state
    });
    window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card w-full max-w-2xl p-8 md:p-12 lg:p-16 rounded-[2.5rem] text-center relative z-10"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/60 mb-4">
              Welcome
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Connect your Discord account to access the dashboard and manage your server settings.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <DiscordButton 
              onClick={handleLogin}
              className="w-full sm:w-auto text-lg px-10 py-5"
            >
              Continue with Discord
            </DiscordButton>

            <p className="text-xs text-white/20 mt-4">
              Secure authentication via Discord OAuth2
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
