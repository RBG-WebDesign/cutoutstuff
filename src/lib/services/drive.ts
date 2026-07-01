import fs from "fs";
import path from "path";
import { google } from "googleapis";

export interface DriveFolderResult {
  folderUrl: string;
  folderId: string;
}

export async function createOrderFolder(folderName: string): Promise<DriveFolderResult> {
  const isMock = process.env.USE_LOCAL_MOCKS === "true" || !process.env.GOOGLE_DRIVE_CLIENT_EMAIL;

  if (isMock) {
    // Local mock: create folder under public/uploads/drive_mirror
    const baseDir = path.join(process.cwd(), "public", "uploads", "drive_mirror");
    const folderPath = path.join(baseDir, folderName);
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    return {
      folderUrl: `/uploads/drive_mirror/${encodeURIComponent(folderName)}`,
      folderId: `mock_drive_folder_${Math.random().toString(36).substring(2, 10)}`,
    };
  }

  // Real Google Drive integration
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive"]
  });

  const drive = google.drive({ version: "v3", auth });

  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: parentFolderId ? [parentFolderId] : undefined,
  };

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: "id,webViewLink",
  });

  // Make the folder publicly readable by link if desired, or leave private
  try {
    await drive.permissions.create({
      fileId: folder.data.id!,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  } catch (err) {
    console.warn("Failed to set public read permissions on folder", err);
  }

  const updatedFolder = await drive.files.get({
    fileId: folder.data.id!,
    fields: "webViewLink",
  });

  return {
    folderUrl: updatedFolder.data.webViewLink || "",
    folderId: folder.data.id || "",
  };
}

export async function uploadFileToFolder(
  folderId: string,
  localFilePath: string,
  mimeType: string
): Promise<string> {
  const isMock = process.env.USE_LOCAL_MOCKS === "true" || !process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const fileName = path.basename(localFilePath);

  if (isMock) {
    // If local folder is mapped, find the local folder matching local uploads
    // We already create mock folders. Let's find if we can copy file there
    // To do this, let's parse mock folder name. If folderId is not the local path,
    // let's assume we can copy it into the active mock folders.
    // Wait, let's keep it simple: we copy the file to the drive mirror folder on disk.
    // But how do we know the directory? We can pass folderName or resolve it.
    // Let's resolve the folder path by searching directories in public/uploads/drive_mirror
    const baseDir = path.join(process.cwd(), "public", "uploads", "drive_mirror");
    
    // Check if we have subdirectories, find the one we created or use a generic one
    let destDir = baseDir;
    if (fs.existsSync(baseDir)) {
      const folders = fs.readdirSync(baseDir);
      // Try to find if there is a folder created recently or just use the first folder
      if (folders.length > 0) {
        // If folders are present, we can write to the most recently modified directory
        const folderPaths = folders.map(f => ({
          name: f,
          path: path.join(baseDir, f),
          time: fs.statSync(path.join(baseDir, f)).mtime.getTime()
        })).sort((a, b) => b.time - a.time);
        destDir = folderPaths[0].path;
      }
    }

    const destPath = path.join(destDir, fileName);
    fs.copyFileSync(localFilePath, destPath);
    const relFolder = path.basename(destDir);
    return `/uploads/drive_mirror/${encodeURIComponent(relFolder)}/${encodeURIComponent(fileName)}`;
  }

  // Real Google Drive integration
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive"]
  });

  const drive = google.drive({ version: "v3", auth });

  const media = {
    mimeType,
    body: fs.createReadStream(localFilePath),
  };

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "webViewLink",
  });

  return file.data.webViewLink || "";
}
