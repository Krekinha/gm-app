import { exampleController } from "@/features/example";
import { igniter } from "@/igniter";

/**
 * @description Main application router configuration
 * @see https://github.com/felipebarcelospro/igniter-js
 */
export const AppRouter = igniter.router({
  controllers: {
    example: exampleController,
  },
});

export type AppRouterType = typeof AppRouter;
