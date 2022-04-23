import { IPluginMiddleware } from "@verdaccio/types"
import { Application, static as expressServeStatic } from "express"

import { publicRoot, staticPath } from "../../constants"
import { logger } from "../../logger"

/**
 * Serves additional static assets required to modify the login button.
 */
export class ServeStatic implements IPluginMiddleware<any> {
  /**
   * IPluginMiddleware
   */
  register_middlewares(app: Application) {
    logger.log('testabc', publicRoot)
    app.use(staticPath, expressServeStatic(publicRoot))
  }
}
