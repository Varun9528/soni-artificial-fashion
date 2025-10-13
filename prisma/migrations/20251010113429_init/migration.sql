-- AlterTable
ALTER TABLE `products` ADD COLUMN `discountPrice` DOUBLE NULL,
    ADD COLUMN `material` VARCHAR(191) NULL,
    ADD COLUMN `size` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;
