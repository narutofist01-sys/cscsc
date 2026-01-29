import { motion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface CallbackStateProps {
  status: "loading" | "success" | "error";
  message?: string;
  errorDetails?: string;
}

export function CallbackState({ status, message, errorDetails }: CallbackStateProps) {
  
  // Trigger confetti on success
  useEffect(() => {
    if (status === "success") {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#5865F2', '#EB459E', '#FFFFFF']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#5865F2', '#EB459E', '#FFFFFF']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      // Delay slightly to match the checkmark animation
      setTimeout(frame, 500);
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto text-center">
      {/* Visual Indicator Container */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        
        {/* Loading State */}
        {status === "loading" && (
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary/80 animate-pulse" />
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="relative w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Outer Circle Animation */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-green-500/20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                className="text-green-500 animate-circle"
              />
              
              {/* Checkmark Animation - matches the custom animation in index.css */}
              <path
                d="M28 50 L45 66 L72 35"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white animate-check"
              />
            </svg>
            
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full -z-10 animate-pulse" />
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="relative w-24 h-24 flex items-center justify-center bg-red-500/10 rounded-full border-2 border-red-500/50">
            <X className="w-10 h-10 text-red-500" />
            <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full -z-10" />
          </div>
        )}
      </div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className={`text-3xl font-display font-bold ${
          status === "success" ? "text-green-400" : 
          status === "error" ? "text-red-400" : "text-white"
        }`}>
          {status === "loading" && "Authorizing..."}
          {status === "success" && "Success!"}
          {status === "error" && "Authorization Failed"}
        </h2>
        
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {message || "Please wait while we verify your Discord credentials..."}
        </p>

        {errorDetails && (
          <div className="mt-6 p-4 bg-red-950/30 border border-red-500/20 rounded-xl text-sm text-red-300 font-mono break-all">
            {errorDetails}
          </div>
        )}

        {status === "success" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="pt-6"
          >
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full w-full animate-[slide-right_1.5s_ease-out]" style={{ width: '100%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Redirecting to dashboard...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
