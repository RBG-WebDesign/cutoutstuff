const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear existing orders
  await prisma.issue.deleteMany();
  await prisma.order.deleteMany();

  // Create mock orders
  const orders = [
    {
      id: "CS-1001",
      customerName: "Austin Smith",
      customerEmail: "austin@example.com",
      shippingAddress: JSON.stringify({
        street: "123 Main St",
        city: "Seattle",
        state: "WA",
        zip: "98101",
        country: "USA"
      }),
      size: "5ft",
      quantity: 1,
      options: JSON.stringify({
        touchUp: true,
        customMessage: "Happy Birthday!",
        rushOrder: false,
        proofRequest: true
      }),
      originalImageUrl: "/uploads/mock_original_1.jpg",
      previewImageUrl: "/uploads/mock_preview_1.png",
      previewApproved: true,
      subtotal: 99.00,
      total: 114.00,
      stripeSessionId: "cs_test_1",
      paymentStatus: "paid",
      orderStatus: "in_production",
      productionStatus: "package_ready",
      driveFolderUrl: "https://drive.google.com/drive/folders/mock_folder_1",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: "CS-1002",
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      shippingAddress: JSON.stringify({
        street: "456 Oak Ave",
        city: "Portland",
        state: "OR",
        zip: "97201",
        country: "USA"
      }),
      size: "3ft",
      quantity: 2,
      options: JSON.stringify({
        touchUp: false,
        customMessage: "",
        rushOrder: true,
        proofRequest: false
      }),
      originalImageUrl: "/uploads/mock_original_2.jpg",
      previewImageUrl: "/uploads/mock_preview_2.png",
      previewApproved: false,
      subtotal: 98.00,
      total: 123.00,
      stripeSessionId: "cs_test_2",
      paymentStatus: "paid",
      orderStatus: "paid",
      productionStatus: "needs_package",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: "CS-1003",
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      shippingAddress: JSON.stringify({
        street: "789 Pine Rd",
        city: "San Francisco",
        state: "CA",
        zip: "94101",
        country: "USA"
      }),
      size: "6ft",
      quantity: 1,
      options: JSON.stringify({
        touchUp: true,
        customMessage: "Welcome!",
        rushOrder: false,
        proofRequest: true
      }),
      originalImageUrl: "/uploads/mock_original_3.jpg",
      previewImageUrl: "",
      previewApproved: false,
      subtotal: 149.00,
      total: 164.00,
      stripeSessionId: "cs_test_3",
      paymentStatus: "paid",
      orderStatus: "issue",
      productionStatus: "cutline_failed",
      createdAt: new Date()
    }
  ];

  for (const o of orders) {
    await prisma.order.create({ data: o });
  }

  // Create issue for CS-1003
  await prisma.issue.create({
    data: {
      id: "IS-1001",
      orderId: "CS-1003",
      type: "cutline_failed",
      status: "open",
      priority: "high",
      note: "Auto-generation of SVG cutline failed. Outer contour could not be resolved from background."
    }
  });

  console.log("Seeded database with mock orders successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
