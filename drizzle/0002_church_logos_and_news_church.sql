ALTER TABLE `churches` ADD `logo_path` text;
--> statement-breakpoint
ALTER TABLE `news_articles` ADD `church_id` integer REFERENCES `churches`(`id`);
