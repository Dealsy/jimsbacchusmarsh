import type { Id } from "convex/_generated/dataModel";

export async function uploadToConvex(
  file: File,
  uploadUrl: string,
): Promise<Id<"_storage"> | null> {
  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!response.ok) {
      return null;
    }

    const json: unknown = await response.json();
    if (
      typeof json !== "object" ||
      json === null ||
      !("storageId" in json) ||
      typeof json.storageId !== "string"
    ) {
      return null;
    }

    return json.storageId as Id<"_storage">;
  } catch {
    return null;
  }
}
