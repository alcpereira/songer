ALTER TABLE `songs` RENAME COLUMN `youtube_link` TO `youtube_id`;--> statement-breakpoint
DROP INDEX IF EXISTS `songs_youtube_link_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `songs_youtube_id_unique` ON `songs` (`youtube_id`);