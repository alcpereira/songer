CREATE TABLE `likes` (
	`id` integer PRIMARY KEY NOT NULL,
	`song_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`value` integer NOT NULL,
	FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `songs` (
	`id` integer PRIMARY KEY NOT NULL,
	`spotify_id` text NOT NULL,
	`spotify_image` text NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`artist` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`permission` text DEFAULT 'user' NOT NULL,
	`hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `songs_spotify_id_unique` ON `songs` (`spotify_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);