CREATE TABLE `content` (
  `id` int(11) NOT NULL,
  `category` varchar(25) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `url` text NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `stats` (
  `id` int(11) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `route` varchar(255) NOT NULL,
  `referer` varchar(255) DEFAULT NULL,
  `isMobile` tinyint(1) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `content` ADD PRIMARY KEY (`id`);
ALTER TABLE `stats` ADD PRIMARY KEY (`id`);
ALTER TABLE `content` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `stats` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
