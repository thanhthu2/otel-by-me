// src/opentelemetry.js
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { Resource } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";

const resourceSettings = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: "fe-reactjs-tracing-demo",
  [SEMRESATTRS_SERVICE_VERSION]: "0.0.1",
});

const provider = new WebTracerProvider({ resource: resourceSettings });

const startOtelInstrumentation = () => {
  const collectorOptions = {
    url: "http://localhost:4318/v1/traces",
    // concurrencyLimit: 10,
  };
  const oltpTraceExporter = new OTLPTraceExporter(collectorOptions);
  provider.addSpanProcessor(new SimpleSpanProcessor(oltpTraceExporter));

  provider.register({
    contextManager: new ZoneContextManager(),
    propagator: new CompositePropagator({
      propagators: [
        new W3CBaggagePropagator(),
        new W3CTraceContextPropagator(),
        new AWSXRayPropagator(),
      ],
    }),
  });

  const {
    diag,
    DiagConsoleLogger,
    DiagLogLevel,
  } = require("@opentelemetry/api");
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

  console.log(new DiagConsoleLogger().info())

  console.info(`Registering Otel ${new Date().getMilliseconds()}`);
  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        "@opentelemetry/instrumentation-xml-http-request": {
          enabled: true,
          ignoreUrls: ["/localhost:8081/sockjs-node"],
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [
            // /.+/g
            [new RegExp(process.env.REACT_APP_PUBLIC_BE_URL)],
          ],
        },
        //enabled: true if you want to trace document load
        "@opentelemetry/instrumentation-document-load": {
          enabled: false,
        },
        //enabled: true if you want to trace user interaction
        "@opentelemetry/instrumentation-user-interaction": {
          enabled: false,
        },
        "@opentelemetry/instrumentation-fetch": {
          propagateTraceHeaderCorsUrls: /.*/,
          clearTimingResources: true,
        },
      }),
    ],
  });
};

startOtelInstrumentation();
