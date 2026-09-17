import type { PersonItem } from './types';
import { DEFAULT_PEOPLE } from './seedData';

/**
 * Resolves a reliable, publicly accessible cutout image URL for a person.
 * Priority:
 * 1. Explicit cutoutUrl (data: URL, /cutouts/..., or http/https)
 * 2. Explicit photoUrl
 * 3. Seed default cutoutUrl if the person matches a default member by ID, slug, or name
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

  // 3. Match against default seed members
  const def = DEFAULT_PEOPLE.find(
    (dp) =>
      dp.id === person.id ||
      (dp.slug && person.slug && dp.slug.toLowerCase() === person.slug.toLowerCase()) ||
      (dp.name && person.name && dp.name.toLowerCase() === person.name.toLowerCase())
  );

  if (def && def.cutoutUrl && isValidWebUrl(def.cutoutUrl)) {
    return sanitizeUrl(def.cutoutUrl);
  }

  return '';
}
