CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  googleManagerId TEXT NOT NULL,
  password TEXT NOT NULL,
  isOnline BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_info (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  projectId INTEGER NOT NULL,
  logo TEXT,
  phone TEXT,
  email TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  slogan TEXT,
  description TEXT,
  ctaType INTEGER NOT NULL DEFAULT 0,
);

CREATE TABLE IF NOT EXISTS contents (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  projectId INTEGER NOT NULL,
  parentId INTEGER,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  date TIMESTAMP,
  url TEXT,
  image TEXT,
  orderIndex INTEGER NOT NULL DEFAULT 0,
);