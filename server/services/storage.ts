"use server";
import { supabaseAdmin } from "@/lib/supabase";

export async function uploadFileToSupabase(
  file: File,
  tenantId: string,
  fileName: string,
): Promise<{ publicUrl: string; filePath: string }> {
  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .upload(`/${tenantId}/${fileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("documents").getPublicUrl(data?.path || "");

  if (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }

  return { publicUrl, filePath: data.path };
}

export async function deleteFile(filePath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from("documents")
    .remove([filePath]);

  if (error) {
    throw new Error(`File deletion failed: ${error.message}`);
  }
}
