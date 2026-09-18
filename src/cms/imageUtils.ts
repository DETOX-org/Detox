import type { PersonItem } from './types';

/**
 * Resolves a reliable, publicly accessible cutout image URL for a person.
 * Priority:
 * 1. Explicit cutoutUrl (data: URL, /cutouts/..., or http/https)
 * 2. Explicit photoUrl
 */
export function resolvePersonCutout(person: PersonItem): string {
  if (!person) return '';

  const isValidWebUrl = (url: string) => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    // Disallow local filesystem or temporary brain paths
    if (
      trimmed.includes(':\\') ||
      trimmed.includes(':/') ||
      trimmed.includes('.gemini') ||
      trimmed.includes('brain')
    ) {
      // Unless it's http/https
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return false;
      }
    }
    return true;
  };

  const sanitizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('/')
    ) {
      return trimmed;
    }
    return `/${trimmed}`;
  };

  // 1. Explicit cutout URL
  if (person.cutoutUrl && isValidWebUrl(person.cutoutUrl)) {
    return sanitizeUrl(person.cutoutUrl);
  }

  // 2. Explicit photo URL
  if (person.photoUrl && isValidWebUrl(person.photoUrl)) {
    return sanitizeUrl(person.photoUrl);
  }

  return '';
}
