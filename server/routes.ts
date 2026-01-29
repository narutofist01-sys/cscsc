import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import axios from "axios";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.auth.discordCallback.path, async (req, res) => {
    try {
      const { code, guildId: bodyGuildId, state } = api.auth.discordCallback.input.parse(req.body);
      const guildId = bodyGuildId || state;

      if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
        console.error("Missing Discord OAuth configuration. Found:", {
          hasClientId: !!process.env.CLIENT_ID,
          hasClientSecret: !!process.env.CLIENT_SECRET,
          hasRedirectUri: !!process.env.REDIRECT_URI,
          redirectUri: process.env.REDIRECT_URI
        });
        return res.status(500).json({ message: "Server misconfiguration: Missing OAuth credentials" });
      }

      const tokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: process.env.REDIRECT_URI,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      const userData = userResponse.data;
      const expiresAt = new Date(Date.now() + expires_in * 1000);

      const authUser = await storage.createOrUpdateAuthUser({
        userId: userData.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expiresAt,
        guildId: guildId, // Pass single guildId to storage
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
        email: userData.email
      });

      res.json({
        message: "Authorization successful",
        user: authUser
      });

    } catch (error: any) {
      console.error('OAuth Error:', error.response?.data || error.message);
      res.status(500).json({ 
        message: "Authentication failed", 
        details: error.response?.data || error.message 
      });
    }
  });

  app.get("/api/guilds/:guildId/members", async (req, res) => {
    try {
      const { guildId } = req.params;
      
      if (!guildId) {
        return res.status(400).json({ message: "Guild ID is required" });
      }

      const members = await storage.getMembersByGuild(guildId);
      const count = members.length;

      res.json({
        guildId,
        members,
        count
      });
    } catch (error: any) {
      console.error('Get members error:', error.message);
      res.status(500).json({ message: "Failed to get members" });
    }
  });

  return httpServer;
}
