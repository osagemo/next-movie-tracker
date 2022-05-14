-- CreateTable
CREATE TABLE `Users_MovieLists` (
    `userId` VARCHAR(191) NOT NULL,
    `movieListId` INTEGER NOT NULL,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `movieListId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
