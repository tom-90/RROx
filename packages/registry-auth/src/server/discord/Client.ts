import DiscordOauth2 from "discord-oauth2"
import { logger } from "../../logger";
``
export class DiscordClient {
  private discord = new DiscordOauth2();

  requestAccessToken = async (
    code: string,
    callbackUrl: string,
    clientId: string,
    clientSecret: string,
  ) => {
    try {
      const res = await this.discord.tokenRequest({
        clientId,
        clientSecret,
        code,
        redirectUri: callbackUrl,
        grantType: 'authorization_code',
        scope: 'identify guilds.members.read'
      })
      return res.access_token;
    } catch (error) {
      logger.log(error.req);
      logger.log(error.res);
      logger.log(error.response);
      throw new Error("Failed requesting Discord access token: " + error.message)
    }
  }

  requestUser = async (accessToken: string) => {
    try {
      return await this.discord.getUser(accessToken);
    } catch (error) {
      throw new Error("Failed requesting Discord user info: " + error.message)
    }
  }

  requestRoles = async (accessToken: string, guildId: string) => {
    try {
      const member = await this.discord.getGuildMember(accessToken, guildId);
      return member.roles;
    } catch (error) {
      if(typeof error === 'object' && 'code' in error && error.code === 10004) {
        throw new Error("You are not a member of the RROx discord server. Please join this server first.");
      }
      throw new Error("Failed requesting Discord roles: " + error.message)
    }
  }
}
