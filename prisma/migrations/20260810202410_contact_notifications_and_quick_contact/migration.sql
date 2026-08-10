-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "autoReplyEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "autoReplyEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoReplyTr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "floatingEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "notifyEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showCallButton" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "whatsappNumber" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "whatsappTextEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "whatsappTextTr" TEXT NOT NULL DEFAULT '';
