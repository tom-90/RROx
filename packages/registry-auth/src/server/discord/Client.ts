import DiscordOauth2 from "discord-oauth2"
import { logger } from "../../logger";

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
        scope: 'identify'
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
}
