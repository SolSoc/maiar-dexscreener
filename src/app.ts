import { UserInputContext } from "@maiar-ai/core";
import {
  ExpressPlatformContext,
  ExpressRequest,
} from "@maiar-ai/plugin-express";
import express, { NextFunction, Response } from "express";

const router = express();

router.post("/message", async (req: ExpressRequest, res, next) => {
  const { message, user } = req.body;

  if (!req.plugin) {
    return next(Error("Plugin not found"));
  }
  console.log(
    `[Express Plugin] Received message from user ${user || "anonymous"}:`,
    message
  );

  const pluginId = req.plugin.id;
  // Create new context chain with initial user input
  const initialContext: UserInputContext = {
    id: `${pluginId}-${Date.now()}`,
    pluginId: pluginId,
    type: "user_input",
    action: "receive_message",
    content: message,
    timestamp: Date.now(),
    rawMessage: message,
    user: user || "anonymous",
  };

  // Create event with initial context and response handler
  const platformContext: ExpressPlatformContext = {
    platform: pluginId,
    responseHandler: (result: unknown) => res.json(result),
    metadata: {
      req,
      res,
    },
  };

  await req.plugin.runtime.createEvent(initialContext, platformContext);
});

router.use(
  (err: Error, req: ExpressRequest, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
);
export default router;
