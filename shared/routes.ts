import { z } from "zod";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    discordCallback: {
      method: "POST" as const,
      path: "/api/auth/discord/callback",
      input: z.object({
        code: z.string(),
        guildId: z.string().optional(),
        state: z.string().optional(),
      }),
      responses: {
        200: z.object({
          message: z.string(),
          user: z.any(),
        }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  guilds: {
    getMembers: {
      method: "GET" as const,
      path: "/api/guilds/:guildId/members",
      responses: {
        200: z.object({
          guildId: z.string(),
          members: z.array(z.any()),
          count: z.number(),
        }),
        404: errorSchemas.internal,
      },
    },
  },
};

export type DiscordCallbackRequest = {
  code: string;
  guildId?: string;
  state?: string;
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
