import { InstrumentationBase } from '@opentelemetry/instrumentation';
import { addBasicAttributes } from './basic-attributes';

export class ErrorInstrumentation extends InstrumentationBase {
  constructor() {
    super('error-instrumentation', 'v0.1.0');
  }
  protected init(): void {}

  parseError(error: Error) {
    const { message, stack } = error;
    return { message, stack };
  }
  report(error: Error, type: 'unhandledRejection' | 'error' | 'errorEvent') {
    const span = this.tracer.startSpan('error');
    const { message, stack } = this.parseError(error);
    span.setAttribute('error.message', message);
    span.setAttribute('error.type', type);
    if (stack) span.setAttribute('error.stack', stack);
    addBasicAttributes(span);
    span.end();
  }
  enable() {
    window.addEventListener('error', (event: ErrorEvent) => {
      this.report(event.error, 'error');
    });

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.report(event.reason, 'unhandledRejection');
    });
    document.documentElement.addEventListener(
      'error',
      (event: ErrorEvent) => {
        this.report(event.error, 'error');
      },
      {
        capture: true,
      }
    );

    window.addEventListener('error', event => {
      this.tracer.startSpan('error', { attributes: { error: event.error } }).end();
    });
  }
}
