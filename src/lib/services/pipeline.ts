import fs from "fs";
import path from "path";
import { db } from "@/lib/db";
import { createOrderFolder, uploadFileToFolder } from "./drive";

export async function generateProductionPackage(orderId: string): Promise<{ success: boolean; driveFolderUrl?: string }> {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const lastName = order.customerName.trim().split(" ").pop() || "Customer";
    const folderName = `${order.id}_${lastName}`;

    // 1. Create Google Drive folder (mock or real)
    const folderResult = await createOrderFolder(folderName);
    const driveFolderUrl = folderResult.folderUrl;
    const folderId = folderResult.folderId;

    // 2. Determine paths on disk
    const isMock = process.env.USE_LOCAL_MOCKS === "true" || !process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    const baseUploadsDir = path.join(process.cwd(), "public");

    // Local folder to drop temporary or mirrored files
    const localPackageDir = path.join(process.cwd(), "public", "uploads", "drive_mirror", folderName);
    if (!fs.existsSync(localPackageDir)) {
      fs.mkdirSync(localPackageDir, { recursive: true });
    }

    // 3. Original Image Copy
    const originalLocalRelPath = order.originalImageUrl;
    const originalLocalAbsPath = path.join(baseUploadsDir, originalLocalRelPath);
    const destOriginalName = `${order.id}_original${path.extname(originalLocalRelPath) || ".jpg"}`;
    const destOriginalPath = path.join(localPackageDir, destOriginalName);

    if (fs.existsSync(originalLocalAbsPath)) {
      fs.copyFileSync(originalLocalAbsPath, destOriginalPath);
      if (!isMock) {
        await uploadFileToFolder(folderId, destOriginalPath, "image/jpeg");
      }
    }

    // 4. Preview Image Copy
    const previewLocalRelPath = order.previewImageUrl;
    const previewLocalAbsPath = path.join(baseUploadsDir, previewLocalRelPath);
    const destPreviewName = `${order.id}_preview${path.extname(previewLocalRelPath) || ".png"}`;
    const destPreviewPath = path.join(localPackageDir, destPreviewName);

    if (fs.existsSync(previewLocalAbsPath)) {
      fs.copyFileSync(previewLocalAbsPath, destPreviewPath);
      if (!isMock) {
        await uploadFileToFolder(folderId, destPreviewPath, "image/png");
      }
    }

    // 5. Generate Order Work Ticket (TXT format)
    const addressObj = JSON.parse(order.shippingAddress);
    const addressStr = `${addressObj.street}, ${addressObj.city}, ${addressObj.state} ${addressObj.zip}, ${addressObj.country}`;
    const optionsObj = JSON.parse(order.options);
    const optionsList = Object.keys(optionsObj).filter(k => optionsObj[k]).join(", ") || "Standard Finish";

    const ticketContent = `
========================================
       CUTOUTSTUFF PRODUCTION WORK TICKET
========================================
Order ID:      ${order.id}
Customer Name: ${order.customerName}
Email:         ${order.customerEmail}
Date Placed:   ${order.createdAt.toISOString()}
Size:          ${order.size}
Quantity:      ${order.quantity}
Options:       ${optionsList}
Total Paid:    $${order.total.toFixed(2)}

----------------------------------------
Shipping Destination:
----------------------------------------
Street:  ${addressObj.street}
City:    ${addressObj.city}
State:   ${addressObj.state}
ZIP:     ${addressObj.zip}
Country: ${addressObj.country}

----------------------------------------
Production Specs:
----------------------------------------
Material: 10mm Premium rigid foam-board
Stand:    Easel-back stand included
Cutline:  Contour shape with 0.5-inch white border
    `;

    const ticketName = `${order.id}_order-ticket.txt`;
    const ticketPath = path.join(localPackageDir, ticketName);
    fs.writeFileSync(ticketPath, ticketContent.trim());
    if (!isMock) {
      await uploadFileToFolder(folderId, ticketPath, "text/plain");
    }

    // 6. Generate SVG Cutline
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1500" width="1000" height="1500">
  <rect x="0" y="0" width="1000" height="1500" fill="none" stroke="#E3E7EE" strokeWidth="1"/>
  <!-- Cutline Contour Path representing order ${order.id} -->
  <path d="M 150 150 A 350 350 0 0 1 850 150 L 850 1350 A 350 350 0 0 1 150 1350 Z" fill="none" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8,8"/>
  <text x="500" y="750" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontSize="28" fill="#FF0000">CUTLINE PLOTTER PATH: ORDER ${order.id}</text>
</svg>
    `;

    const svgName = `${order.id}_cutline.svg`;
    const svgPath = path.join(localPackageDir, svgName);
    fs.writeFileSync(svgPath, svgContent.trim());
    if (!isMock) {
      await uploadFileToFolder(folderId, svgPath, "image/svg+xml");
    }

    // 7. Update DB order record
    await db.order.update({
      where: { id: orderId },
      data: {
        driveFolderUrl: driveFolderUrl,
        productionStatus: "package_uploaded",
      },
    });

    console.log(`[Pipeline Service] Successfully generated and uploaded production package for order ${orderId}`);
    return { success: true, driveFolderUrl };
  } catch (err: any) {
    console.error("Package pipeline error:", err);
    return { success: false };
  }
}
