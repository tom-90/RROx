import { Request } from "express"
import { stringify } from "querystring"
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
      scope: "identify",
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
    return user.username
  }

  async getGroups(token: string) {
    return [
      await this.getUsername(token)
    ];
  }
}
