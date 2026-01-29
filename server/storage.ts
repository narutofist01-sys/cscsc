import { AuthUser } from "@shared/schema";

export interface IStorage {
  getAuthUser(userId: string): Promise<any>;
  createOrUpdateAuthUser(user: any): Promise<any>;
  countAuthUsersByGuild(guildId: string): Promise<number>;
  getMembersByGuild(guildId: string): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getAuthUser(userId: string): Promise<any> {
    return await AuthUser.findOne({ userId }).lean();
  }

  async createOrUpdateAuthUser(insertUser: any): Promise<any> {
    const existing = await AuthUser.findOne({ userId: insertUser.userId });
    
    // Extract guildId and convert to array for storage
    const newGuilds = insertUser.guildId ? [insertUser.guildId] : [];
    delete insertUser.guildId;

    if (existing) {
      const existingGuilds = (existing.guilds as string[]) || [];
      const mergedGuilds = Array.from(new Set([...existingGuilds, ...newGuilds]));

      return await AuthUser.findOneAndUpdate(
        { userId: insertUser.userId },
        { 
          ...insertUser, 
          guilds: mergedGuilds
        },
        { new: true }
      ).lean();
    } else {
      const user = new AuthUser({
        ...insertUser,
        guilds: newGuilds
      });
      return await user.save();
    }
  }

  async countAuthUsersByGuild(guildId: string): Promise<number> {
    return await AuthUser.countDocuments({ guilds: guildId });
  }

  async getMembersByGuild(guildId: string): Promise<any[]> {
    return await AuthUser.find({ guilds: guildId }).select({
      userId: 1,
      username: 1,
      discriminator: 1,
      avatar: 1,
      createdAt: 1,
      _id: 0
    }).lean();
  }
}

export const storage = new DatabaseStorage();
