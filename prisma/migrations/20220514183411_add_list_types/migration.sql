/*
  Warnings:

  - Added the required column `listType` to the `MovieLists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MovieLists` ADD COLUMN `listType` ENUM('SEEN', 'WANNA') NOT NULL;
