CREATE TABLE `oration-test_account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`refresh_token_expires_in` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `oration-test_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `oration-test_account` (`userId`);--> statement-breakpoint
CREATE TABLE `oration-test_chat_message` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessionId` text(255) NOT NULL,
	`role` text(32) NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`sessionId`) REFERENCES `oration-test_chat_session`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chat_message_session_idx` ON `oration-test_chat_message` (`sessionId`);--> statement-breakpoint
CREATE INDEX `chat_message_created_idx` ON `oration-test_chat_message` (`createdAt`);--> statement-breakpoint
CREATE TABLE `oration-test_chat_session` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`title` text(255) DEFAULT 'New Career Chat' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	`lastMessageAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `oration-test_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `chat_session_user_idx` ON `oration-test_chat_session` (`userId`);--> statement-breakpoint
CREATE INDEX `chat_session_last_msg_idx` ON `oration-test_chat_session` (`lastMessageAt`);--> statement-breakpoint
CREATE TABLE `oration-test_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`createdById` text(255) NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`createdById`) REFERENCES `oration-test_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `oration-test_post` (`createdById`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `oration-test_post` (`name`);--> statement-breakpoint
CREATE TABLE `oration-test_session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `oration-test_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `oration-test_session` (`userId`);--> statement-breakpoint
CREATE TABLE `oration-test_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`emailVerified` integer DEFAULT (unixepoch()),
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `oration-test_verification_token` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
