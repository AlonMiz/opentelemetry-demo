// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Context } from '@opentelemetry/api';
import { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-web';

const us = 'United States of America';
const mapTimezoneToCountry: Record<string, string> = {
  Eastern: us,
  Central: us,
  Mountain: us,
  Pacific: us,
  Alaska: us,
};

const addBasicAttributes = (span: Span): void => {
  span.setAttribute('pathname', window.location.pathname);
  span.setAttribute('search', window.location.search);
  span.setAttribute('hash', window.location.hash);
  span.setAttribute('timezone', Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone);
  // get country from Date object
  // Sun Dec 24 2023 12:31:34 GMT+0200 (Israel Standard Time)
  const dateString = new Date().toString();
  const country = dateString.split('(')[1].split(' ')[0];
  const countryFromTimezone = mapTimezoneToCountry[country] || country;
  span.setAttribute('country', countryFromTimezone);
};

export class ContextProcessor implements SpanProcessor {
  meta: Record<string, string | undefined | null> = {};
  constructor(meta?: Record<string, string | undefined | null>) {
    if (meta && typeof meta !== 'object') throw new Error('meta must be an object');
    this.meta = meta ?? {};
  }
  forceFlush(): Promise<void> {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart(span: Span, parentContext: Context): void {
    Object.entries(this.meta).forEach(([k, v]) => {
      if (v) span.setAttribute(k, v);
    });
    addBasicAttributes(span);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onEnd(span: ReadableSpan): void {}

  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}
