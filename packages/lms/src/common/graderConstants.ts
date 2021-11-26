/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const getUrlPrefix = () => ((window as any).url_prefix || '') as string;

export const getBaseUrl = () => ((window as any).base_url || '') as string;

export const getBaseUrlSuffix = () => ((window as any).base_url_suffix || '') as string;
