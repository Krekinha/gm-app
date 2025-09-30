import { createConsoleTelemetryAdapter } from "@igniter-js/core/adapters";
import { store } from "./store";

/**
 * Telemetry service for tracking requests and errors.
 *
 * @remarks
 * Provides telemetry tracking with configurable options.
 *
 * @see https://github.com/felipebarcelospro/igniter-js/tree/main/packages/core
 */
export const telemetry = createConsoleTelemetryAdapter(
  {
    serviceName: "sample-next-app",
    enableEvents: false, // Desabilitado para remover mensagens do console
    enableMetrics: false, // Desabilitado para remover mensagens do console
    enableTracing: false, // Desabilitado para remover mensagens do console
  },
  {
    enableCliIntegration: false, // Desabilitado para remover mensagens do console
    store: store,
  }
);
