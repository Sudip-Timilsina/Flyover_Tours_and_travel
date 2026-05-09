import { randomUUID } from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Strict remote storage: require Supabase env vars
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_BUCKET) {
  throw new Error(
    "Supabase storage is not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_BUCKET."
  );
}

const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const dataUrlPattern = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/;
const MAX_DATA_URL_SIZE = 10 * 1024 * 1024; // 10MB limit for data URLs

function extensionFromMimeType(mimeType: string) {
  // Normalize MIME type (remove parameters like charset)
  const baseMimeType = mimeType.split(";")[0].toLowerCase().trim();
  
  switch (baseMimeType) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    case "image/avif":
      return "avif";
    case "image/bmp":
      return "bmp";
    case "image/tiff":
      return "tiff";
    case "image/x-icon":
      return "ico";
    default:
      // Default to jpg for unknown types
      return "jpg";
  }
}

export async function persistImageReference(
  image: string | null | undefined,
  prefix: string
) {
  if (!image) return null;

  if (!image.startsWith("data:")) {
    // It's already a URL, return as-is
    return image;
  }

  // Check if data URL is too large
  if (image.length > MAX_DATA_URL_SIZE) {
    throw new Error("Image is too large. Please use a smaller image (max 10MB).");
  }

  const match = image.match(dataUrlPattern);
  if (!match) {
    throw new Error("Invalid image format. The image could not be processed.");
  }

  const [, mimeType, base64Data] = match;
  
  // Validate that base64 is valid
  if (!base64Data || base64Data.length === 0) {
    throw new Error("Image data is empty or corrupted.");
  }

  const fileExtension = extensionFromMimeType(mimeType);
  const fileName = `${prefix}-${randomUUID()}.${fileExtension}`;

  try {
    const buffer = Buffer.from(base64Data, "base64");

    if (buffer.length < 100) {
      throw new Error("Image data appears to be corrupted or too small.");
    }

    const objectPath = `${prefix}/${Date.now()}-${fileName}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from(SUPABASE_BUCKET)
      .upload(objectPath, buffer, { contentType: mimeType, upsert: false });

    if (uploadError) {
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from(SUPABASE_BUCKET).getPublicUrl(objectPath);
    const publicUrl = publicUrlData?.publicUrl || publicUrlData?.public_url || null;
    if (!publicUrl) throw new Error("Failed to obtain public URL from Supabase storage.");

    return publicUrl;
  } catch (err: any) {
    if (err.message && err.message.includes("corrupted")) {
      throw err;
    }
    throw new Error(`Failed to upload image to Supabase: ${err?.message || String(err)}`);
  }
}
