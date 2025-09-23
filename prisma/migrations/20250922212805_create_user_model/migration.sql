-- CreateTable
CREATE TABLE `pe_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(45) NULL,
    `lastName` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NULL,
    `password` VARCHAR(250) NOT NULL,
    `role` VARCHAR(45) NOT NULL,
    `department` VARCHAR(45) NOT NULL,
    `phone` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
