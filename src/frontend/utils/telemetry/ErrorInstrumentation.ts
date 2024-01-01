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
  report = (error: Error, type: 'unhandledRejection' | 'error' | 'errorEvent' | 'documentError' | 'errorLog') => {
    const span = this.tracer.startSpan('error');
    span.setAttribute('error.type', type);
    const { message, stack } = this.parseError(error);
    span.setAttribute('error.message', message);
    if (stack) span.setAttribute('error.stack', stack);
    addBasicAttributes(span);
    span.end();
  };

  errorListener = (event: ErrorEvent) => {
    this.report(event.error, 'errorEvent');
  };

  unhandledRejectionListener = (event: PromiseRejectionEvent) => {
    this.report(event.reason, 'unhandledRejection');
  };

  documentErrorListener = (event: ErrorEvent) => {
    this.report(event.error, 'documentError');
  };

  enable() {
    debugger;
    window.addEventListener('unhandledrejection', this.unhandledRejectionListener);
    window.addEventListener('error', this.errorListener);
    document.documentElement.addEventListener('error', this.documentErrorListener, { capture: true });
  }

  // disable() {
  //   window.removeEventListener('error', this.errorListener);
  //   window.removeEventListener('unhandledrejection', this.unhandledRejectionListener);
  //   document.documentElement.removeEventListener('error', this.documentErrorListener, {
  //     capture: true,
  //   });
  // }
}
