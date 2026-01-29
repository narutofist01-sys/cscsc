import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscordButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function DiscordButton({ className, isLoading, children, ...props }: DiscordButtonProps) {
  return (
    <button
      className={cn(
        "relative group px-8 py-4 rounded-xl font-semibold text-white",
        "bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3C45A5]",
        "shadow-lg shadow-[#5865F2]/25 hover:shadow-xl hover:shadow-[#5865F2]/40",
        "transition-all duration-300 ease-out transform hover:-translate-y-1 active:translate-y-0",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        "flex items-center justify-center gap-3",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 127.14 96.36">
          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c.12-23.61-4.38-47.56-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
        </svg>
      )}
      {children}
    </button>
  );
}
