import plugin from "../package.json"
import path from "path"

export { plugin }

export const pluginKey = "rrox-registry-auth"
export const publicRoot = path.resolve( __dirname + "/../client" )
export const staticPath = "/-/static/" + pluginKey
export const authorizePath = "/-/oauth/authorize"
export const callbackPath = "/-/oauth/callback"
export const loginHref = authorizePath
export const logoutHref = "/"

/**
 * See https://verdaccio.org/docs/en/packages
 */
export const authenticatedUserGroups = [
  "$all",
  "@all",
  "$authenticated",
  "@authenticated",
] as const
