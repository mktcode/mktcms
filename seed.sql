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
  '2025-01-01',
  'https://www.google.com',
  'header-placeholder.jpg'
);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  2,
  'Produkt 1',
  'produkt-1',
  'Ein Platzhalter-Produkt',
  'Dieses Produkt ist nur ein Platzhalter und kann gelöscht bzw. bearbeitet werden.',
  '2025-01-01',
  'https://www.google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (id, contentId, categoryId) VALUES (1, 2, 1);

-- Pages
INSERT INTO pages (id, title, route) VALUES (1, 'Startseite', null);
INSERT INTO pages (id, title, route) VALUES (2, 'Info', 'info');
INSERT INTO pages (id, title, route) VALUES (3, 'Produktdetails', 'produkte/?');

-- Sections - Home
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (1, 1, null, 1, 'Header', 0);
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (2, 1, 1, null, 'ContentGrid', 1);

-- Sections - Info
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (3, 2, null, 1, 'Header', 0);
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (4, 2, null, 1, 'Content', 1);
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (5, 2, null, null, 'Footer', 2);

-- Sections - Productdetails
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (6, 3, null, 1, 'Header', 0);
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (7, 3, null, null, 'Content', 1);
INSERT INTO sections (id, pageId, categoryId, contentId, component, orderIndex) VALUES (8, 3, null, null, 'Footer', 2);