import { useMutation } from "@tanstack/react-query";
import { api, type DiscordCallbackRequest } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useDiscordCallback() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: DiscordCallbackRequest) => {
      const res = await apiRequest(
        api.auth.discordCallback.method,
        api.auth.discordCallback.path,
        data
      );
      
      const json = await res.json();
      return api.auth.discordCallback.responses[200].parse(json);
    },
    onError: (error: Error) => {
      toast({
        title: "Authorization Failed",
        description: error.message || "Could not complete the Discord handshake.",
        variant: "destructive",
      });
    },
  });
}
