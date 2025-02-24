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

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  route TEXT
);

CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pageId INTEGER,
  categoryId INTEGER,
  contentId INTEGER,
  component TEXT NOT NULL,
  orderIndex INTEGER DEFAULT 0
);

--
-- Seed
--

-- Theme
INSERT INTO theme (id, primaryColor, primaryColorHover) VALUES (1, '#8b0836', '#b6325e');

-- Categories
INSERT INTO categories (id, name, label) VALUES (1, 'products', 'Produkte');

-- Content
INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  1,
  'Demo Inhalt',
  'demo-inhalt',
  'Ein Platzhalter für die Beschreibung',
  'Dieser Inhalt ist nur ein Platzhalter und kann gelöscht bzw. bearbeitet werden.',
  '2020-01-01',
  'https://www.google.com',
  'header-placeholder.jpg'
);

-- Pages
INSERT INTO pages (id, title, route) VALUES (1, 'Startseite', null);
INSERT INTO pages (id, title, route) VALUES (2, 'Info', 'info');
INSERT INTO pages (id, title, route) VALUES (3, 'Produktdetails', 'produkte/?');

-- Sections - Home
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (1, 1, null, 1, 'Header', 0);

-- Sections - Info
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (2, 2, null, 1, 'Header', 0);
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (3, 2, null, 1, 'Content', 1);
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (4, 2, null, null, 'Footer', 2);

-- Sections - Productdetails
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (5, 3, null, 1, 'Header', 0);
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (6, 3, null, null, 'Content', 1);
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (7, 3, null, null, 'Footer', 2);