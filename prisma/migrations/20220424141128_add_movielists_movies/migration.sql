-- CreateTable
CREATE TABLE `Movies` (
    `MovieId` INTEGER NOT NULL AUTO_INCREMENT,
    `ImdbId` VARCHAR(50) NOT NULL,
    `Title` VARCHAR(255) NOT NULL,
    `ReleaseDateUtc` DATETIME(3) NOT NULL,
    `ImageUrl` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`MovieId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovieLists` (
    `MovieListId` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`MovieListId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovieLists_Movies` (
    `MovieId` INTEGER NOT NULL,
    `MovieListId` INTEGER NOT NULL,
    `AddedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`MovieId`, `MovieListId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
