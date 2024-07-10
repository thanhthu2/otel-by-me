const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

// Kiểm tra URL của OTLPTraceExporter
const exporter = new OTLPTraceExporter({
  url: 'http://otel-collector:4318/v1/traces',
});

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'be-nodejs-tracing-demo',
  }),
});

// Đăng ký SpanProcessor với provider
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// Đăng ký instrumentations
registerInstrumentations({
  instrumentations: [
    new ExpressInstrumentation(),
  ],
});

console.log('Tracing initialized');
