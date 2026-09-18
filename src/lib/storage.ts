import { supabase, isSupabaseConfigured } from './supabase';

export type StorageBucket = 'avatars' | 'people' | 'projects' | 'events' | 'media';

/**
 * Converts a base64 Data URL to a Blob
 */
export function dataUrlToBlob(dataUrl: string): { blob: Blob; mimeType: string } {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return { blob: new Blob([u8arr], { type: mimeType }), mimeType };
}

/**
 * Uploads a file (or DataURL) to Supabase Storage and returns the public CDN URL.
 */
export async function uploadToSupabaseStorage(
  source: File | Blob | string,
  bucket: StorageBucket = 'people',
  fileNameHint = 'asset',
  userId?: string
): Promise<string> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Returning local object representation.');
    if (typeof source === 'string') return source;
    return URL.createObjectURL(source);
  }

  let blob: Blob;
  let ext = 'png';

  if (typeof source === 'string') {
    if (source.startsWith('data:')) {
      const parsed = dataUrlToBlob(source);
      blob = parsed.blob;
      ext = parsed.mimeType.split('/')[1] || 'png';
      if (ext === 'jpeg') ext = 'jpg';
    } else if (source.startsWith('http://') || source.startsWith('https://') || source.startsWith('/')) {
      // Already a hosted URL
      return source;
    } else {
      throw new Error('Invalid string format for storage upload');
    }
  } else if (source instanceof File) {
    blob = source;
    const parts = source.name.split('.');
    if (parts.length > 1) ext = parts.pop() || 'png';
  } else {
    blob = source;
  }

  const cleanHint = fileNameHint.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'file';
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);

  // If uploading to avatars bucket, scope under user ID folder for RLS ownership compliance
  let ownerId = userId;
  if (!ownerId && bucket === 'avatars') {
    const { data: userData } = await supabase.auth.getUser();
    ownerId = userData.user?.id;
  }

  const fileName = `${cleanHint}_${timestamp}_${randomSuffix}.${ext}`;
  const filePath = ownerId ? `${ownerId}/${fileName}` : fileName;

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, blob, {
    cacheControl: '3600',
    upsert: true,
    contentType: blob.type || `image/${ext}`,
  });

  if (error) {
    console.error(`Error uploading to ${bucket}/${filePath}:`, error);
    throw error;
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicData.publicUrl;
}
