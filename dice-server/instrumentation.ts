// /*instrumentation.ts*/
// import { NodeSDK } from "@opentelemetry/sdk-node";
// import {
//   ConsoleSpanExporter,
//   BasicTracerProvider,
//   SimpleSpanProcessor,
//   BatchSpanProcessor,
//   NodeTracerProvider,
// } from "@opentelemetry/sdk-trace-node";
// import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
// import {
//   PeriodicExportingMetricReader,
//   ConsoleMetricExporter,
// } from "@opentelemetry/sdk-metrics";
// import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
// import {
//   SemanticResourceAttributes,
//   SEMRESATTRS_SERVICE_NAME,
// } from "@opentelemetry/semantic-conventions";
// import { Resource } from "@opentelemetry/resources";

// const traceExporter = new OTLPTraceExporter({
//   url: "http://localhost:4318/v1/traces",
// });

// const exporter = new OTLPTraceExporter(traceExporter);

// // const provider = new BasicTracerProvider({
// //   resource: new Resource({
// //     [SEMRESATTRS_SERVICE_NAME]: "dice-server",
// //   }),
// // });

// const provider = new NodeTracerProvider({
//   resource: new Resource({
//     [SEMRESATTRS_SERVICE_NAME]: "dice-server", // Service name that showuld be listed in jaeger ui
//   }),
// });

// provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
// provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// const sdk = new NodeSDK({
//   instrumentations: [
//     getNodeAutoInstrumentations({
//       "@opentelemetry/instrumentation-fs": { enabled: false },
//     }),
//   ],
// });

// sdk.start();


import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
  NodeTracerProvider,
} from "@opentelemetry/sdk-trace-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

// Configure the OTLP trace exporter
const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

// Create a NodeTracerProvider with the service name
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "dice-server", // Service name that should be listed in Jaeger UI
  }),
});

// Add span processors to the provider
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new BatchSpanProcessor(traceExporter));

// Register the provider
provider.register();

// Configure the SDK with auto-instrumentations


const sdk = new NodeSDK({
  traceExporter: traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations(),
  ],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "dice-server", // Ensure the service name is set in SDK as well
  }),
});

// Start the SDK
sdk.start();

console.log("Tracing initialized with service name:", "dice-server");
