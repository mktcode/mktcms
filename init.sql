CREATE TABLE IF NOT EXISTS contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT,
  subtitle TEXT,
  description TEXT,
  date TIMESTAMP,
  url TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contentCategories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contentId INTEGER NOT NULL,
  categoryId INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  route TEXT NOT NULL,
  referer TEXT,
  isMobile INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businessinfo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  zip TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  taxId TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS theme (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  primaryColor TEXT NOT NULL,
  primaryColorHover TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  route TEXT,
  categoryId INTEGER,
  contentId INTEGER,
  isDetailsPage INTEGER DEFAULT 0,
  component TEXT NOT NULL,
  orderIndex INTEGER DEFAULT 0
);

--
-- Seed
--

-- Content
INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  1,
  'Demo Inhalt',
  'demo-inhalt',
  'Ein Platzhalter für die Beschreibung',
  'Dieser Inhalt ist nur ein Platzhalter und kann gelöscht bzw. bearbeitet werden.',
  '2020-01-01',
  'https://www.google.com',
  'https://picsum.photos/600/400'
);


-- Categories
INSERT INTO categories (id, name, label) VALUES (1, 'products', 'Produkte');
INSERT INTO categories (id, name, label) VALUES (2, 'news', 'Neuigkeiten');

-- Theme
INSERT INTO theme (id, primaryColor, primaryColorHover) VALUES (1, '#8b0836', '#b6325e');

-- Sections - Home
INSERT INTO sections (id, name, route, categoryId, isDetailsPage, component, orderIndex) VALUES (1, 'Header', null, null, 0, 'Header', 0);
INSERT INTO sections (id, name, route, categoryId, isDetailsPage, component, orderIndex) VALUES (2, 'About', null, null, 0, 'About', 1);
INSERT INTO sections (id, name, route, categoryId, isDetailsPage, component, orderIndex) VALUES (3, 'Footer', null, null, 0, 'Footer', 2);

-- Sections - Product Overview
INSERT INTO sections (id, name, route, categoryId, isDetailsPage, component, orderIndex) VALUES (4, 'Header', null, 1, 0, 'Header', 0);
INSERT INTO sections (id, name, route, categoryId, isDetailsPage, component, orderIndex) VALUES (5, 'ProductList', null, 1, 0, 'Prices', 1);
INSERT INTO sections (id, name, route, categoryId, isDetailsPage, component, orderIndex) VALUES (6, 'Footer', null, 1, 0, 'Footer', 2);

-- Sections - Product Details
INSERT INTO sections (id, name, route, categoryId, isDetailsPage, component, orderIndex) VALUES (7, 'Header', null, 1, 1, 'Header', 0);
INSERT INTO sections (id, name, route, categoryId, isDetailsPage, component, orderIndex) VALUES (8, 'ProductDetails', null, 1, 1, 'Content', 1);
INSERT INTO sections (id, name, route, categoryId, isDetailsPage, component, orderIndex) VALUES (9, 'Footer', null, 1, 1, 'Footer', 2);