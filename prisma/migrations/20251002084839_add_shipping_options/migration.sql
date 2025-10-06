-- AlterTable
ALTER TABLE `orders` ADD COLUMN `shippingOptionId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `shipping_options` (
    `id` VARCHAR(191) NOT NULL,
    `name` JSON NOT NULL,
    `description` JSON NOT NULL,
    `cost` DOUBLE NOT NULL,
    `minOrderValue` DOUBLE NULL,
    `estimatedDays` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_shippingOptionId_fkey` FOREIGN KEY (`shippingOptionId`) REFERENCES `shipping_options`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
