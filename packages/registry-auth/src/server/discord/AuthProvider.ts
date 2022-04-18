import { Request } from "express"
import { stringify } from "querystring"
import { logger } from "../../logger"
import { AuthProvider } from "../plugin/AuthProvider"
import { ParsedPluginConfig } from "../plugin/Config"
import { DiscordClient } from "./Client"

export class DiscordAuthProvider implements AuthProvider {
  private readonly client = new DiscordClient()

  get webBaseUrl(): string {
    return "https://discord.com/api"
  }

  constructor(private readonly config: ParsedPluginConfig) {}

  getId() {
    return "discord"
  }

  getLoginUrl(callbackUrl: string) {
    const queryParams = stringify({
      client_id: this.config.clientId,
      redirect_uri: callbackUrl,
      scope: "identify guilds.members.read",
      response_type: "code"
    })
    return this.webBaseUrl + `/oauth2/authorize?` + queryParams
  }

  getCode(req: Request) {
    return req.query.code as string
  }

  async getToken(code: string, callbackUrl: string) {
    return await this.client.requestAccessToken(code, callbackUrl, this.config.clientId, this.config.clientSecret);
  }

  async getUsername(token: string) {
    const user = await this.client.requestUser(token)
    return user.username + '#' + user.discriminator
  }

  async getGroups(token: string) {
    const roles = [
      await this.getUsername(token),
      ...( await this.client.requestRoles(token, this.config.guildId))
    ]

    logger.log( roles )
    return roles
  }
}
