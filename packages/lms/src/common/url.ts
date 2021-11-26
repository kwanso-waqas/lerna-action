export const constructUrl = (urlParts: string[]) =>
  urlParts
    .filter((urlPart) => urlPart)
    .map((urlPart) => urlPart.replace(/^\/+/g, '').replace(/\/+$/g, ''))
    .join('/');
