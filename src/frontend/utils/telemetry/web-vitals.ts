import { onFID, onLCP, onCLS, CLSMetric, LCPMetric, FIDMetric, onINP, onTTFB, INPMetric, TTFBMetric } from 'web-vitals';
import { InstrumentationBase, InstrumentationModuleDefinition } from '@opentelemetry/instrumentation';
import { trace, context, Context } from '@opentelemetry/api';
import { hrTime } from '@opentelemetry/core';
import { addBasicAttributes } from './basic-attributes';

export class WebVitalsInstrumentation extends InstrumentationBase {
  constructor() {
    super('web-vitals-instrumentation', 'v0.1.0');
  }
  protected init(): void | InstrumentationModuleDefinition<''> | InstrumentationModuleDefinition<''>[] {}
  enabled = false;
  // function that creates a span for each web vital and reports the data
  // as attributes
  onReport(metric: CLSMetric | LCPMetric | FIDMetric | INPMetric | TTFBMetric, parentSpanContext: Context) {
    const now = hrTime();
    // start the span
    const webVitalsSpan = this.tracer.startSpan(metric.name, { startTime: now }, parentSpanContext);
    // add core web vital attributes
    webVitalsSpan.setAttributes({
      [`web_vital.name`]: metric.name,
      [`web_vital.id`]: metric.id,
      [`web_vital.navigationType`]: metric.navigationType,
      [`web_vital.delta`]: metric.delta,
      [`web_vital.rating`]: metric.rating,
      [`web_vital.value`]: metric.value,
      // can expand these into their own attributes!
      [`web_vital.entries`]: JSON.stringify(metric.entries),
    });

    addBasicAttributes(webVitalsSpan);
    // end the span
    webVitalsSpan.end();
  }
  enable() {
    if (this.enabled) {
      return;
    }
    this.enabled = true;
    // create a parent span that will have all web vitals spans as children
    const parentSpan = trace.getTracer('web-vitals-instrumentation').startSpan('web-vitals');
    const ctx = trace.setSpan(context.active(), parentSpan);
    parentSpan.end();
    // Capture First Input Delay
    onFID(metric => {
      this.onReport(metric, ctx);
    });
    onCLS(metric => {
      this.onReport(metric, ctx);
    });
    onLCP(metric => {
      this.onReport(metric, ctx);
    });
    onINP(metric => {
      this.onReport(metric, ctx);
    });
    onTTFB(metric => {
      this.onReport(metric, ctx);
    });
  }
}
