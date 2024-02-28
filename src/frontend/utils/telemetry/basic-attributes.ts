import { Span } from '@opentelemetry/api';
const us = 'United States of America';
const mapTimezoneToCountry: Record<string, string> = {
  Eastern: us,
  Central: us,
  Mountain: us,
  Pacific: us,
  Alaska: us,
};

export const addBasicAttributes = (span: Span): void => {
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
