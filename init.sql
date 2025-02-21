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
  component TEXT NOT NULL,
  contentId INTEGER,
  categoryId INTEGER,
  orderIndex INTEGER DEFAULT 0
);

--
-- Seed
--

-- Categories
INSERT INTO categories (id, name, label) VALUES (1, 'menu', 'Menü');
INSERT INTO categories (id, name, label) VALUES (2, 'themen', 'Themen');
INSERT INTO categories (id, name, label) VALUES (3, 'angebot', 'Angebot');
INSERT INTO categories (id, name, label) VALUES (4, 'events', 'Veranstaltungen');
INSERT INTO categories (id, name, label) VALUES (5, 'general', 'Allgemein');

-- Hero
INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  1,
  'Finde deine innere Balance.',
  'finde-deine-innere-balance',
  null,
  'Yoga, Ernährung, Achtsamkeit und stilvolles Auftreten - Löse die Trennung zwischen Körper und Geist auf und finde über einen ganzheitlichen Ansatz zu mehr innerer Ruhe und Ausgeglichenheit.',
  null,
  '#contact',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (1, 5);

-- About
INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  2,
  'Gesundheit geht nur ganzheitlich.',
  'gesundheit-geht-nur-ganzheitlich',
  'Inner Balance und Lifestyle Coaching ',
  '<p>Möchtest du dich gesünder ernähren, ohne auf Genuss zu verzichten? Suchst du eine Ernährungsweise, die zu deinem Lebensstil passt – ob vegetarisch, vegan oder klimafreundlich? Ich unterstütze dich dabei, bewusste Entscheidungen zu treffen, die dein Wohlbefinden steigern.</p>
<p>Doch wahre Balance umfasst mehr als nur Ernährung. Bewegung und Achtsamkeit sind ebenso entscheidend. Mit Faszienyoga, Achtsamkeitstraining und kreativem Schreiben helfe ich dir, Stress zu reduzieren, dich selbst besser kennenzulernen und deinen Körper zu stärken.</p>',
  null,
  null,
  'profil-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (2, 5);

-- Topics
INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  3,
  'Faszienyoga',
  'faszienyoga',
  null,
  'Faszienyoga ist eine sanfte und effektive Methode, um Verspannungen zu lösen und die Beweglichkeit zu verbessern. Die Übungen sind speziell auf die Bedürfnisse des modernen Menschen zugeschnitten und stärken die Muskulatur. Durch die Kombination von Dehnung und Kräftigung fördern wir die Körperhaltung und steigern das Wohlbefinden. Die Übungen sind für Anfänger und Fortgeschrittene gleichermaßen geeignet.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (3, 2);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  4,
  'Ernährungsberatung',
  'ernaehrungsberatung',
  null,
  'Ganzheitliche Beratung für mehr Wohlbefinden. In einem persönlichen Gespräch erarbeiten wir gemeinsam, wie du deine Ziele erreichen kannst. Ich unterstütze dich dabei, bewusste Entscheidungen zu treffen, die dein Wohlbefinden steigern.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (4, 2);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  5,
  'Stilberatung',
  'stilberatung',
  null,
  'Stilberatung für mehr Selbstbewusstsein und Ausstrahlung. Entdecke, wie du durch die richtige Kleidung und Accessoires deine Persönlichkeit unterstreichst und deinen individuellen Stil findest.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (5, 2);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  6,
  'Achtsamkeitstraining',
  'achtsamkeitstraining',
  null,
  'Achtsamkeitstraining für mehr innere Ruhe und Ausgeglichenheit. Entdecke, wie du durch einfache Übungen und Meditationen Stress reduzieren und deine Selbstwahrnehmung verbessern kannst. Lerne, im Hier und Jetzt zu sein und bewusst zu leben.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (6, 2);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  7,
  'Kreatives Schreiben',
  'kreatives-schreiben',
  null,
  'Kreatives Schreiben für mehr Klarheit und Selbstreflexion. Entdecke, wie du durch das Schreiben von Tagebuch, Gedichten oder Geschichten deine Gedanken ordnen und deine Gefühle ausdrücken kannst. Lerne, dich selbst besser kennenzulernen und deine Kreativität zu entfalten.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (7, 2);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  8,
  'Beratungspaket',
  'beratungspaket',
  null,
  'Ganzheitliche Beratung für mehr Wohlbefinden. In einem persönlichen Gespräch erarbeiten wir gemeinsam, wie du deine Ziele erreichen kannst. Ich unterstütze dich dabei, bewusste Entscheidungen zu treffen, die dein Wohlbefinden steigern. Entdecke, wie du durch einfache, alltagstaugliche Methoden mehr Leichtigkeit in dein Leben bringst.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (8, 3);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  9,
  'Ernährungsberatung',
  'ernaehrungsberatung',
  null,
  'Eine Stunde individuelle Ernährungsberatung. In einem persönlichen Gespräch erarbeiten wir eine Strategie für deine Ernährung, die zu deinem Lebensstil passt.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (9, 3);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  10,
  'Stilberatung',
  'stilberatung',
  null,
  'Eine Stunde individuelle Stilberatung. In einem persönlichen Gespräch erarbeiten wir gemeinsam, wie du durch die richtige Kleidung und Accessoires deine Persönlichkeit unterstreichst und deinen individuellen Stil findest.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (10, 3);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  11,
  'Yoga am Mittwoch',
  'yoga-am-mittwoch',
  null,
  'Jeden Mittwoch von 18:00 bis 19:30 Uhr findet unser Yoga-Kurs statt. Wir praktizieren Faszienyoga, das speziell auf die Bedürfnisse des modernen Menschen zugeschnitten ist. Die Übungen sind sanft und effektiv, sie stärken die Muskulatur und fördern die Beweglichkeit. Durch die Kombination von Dehnung und Kräftigung lösen wir Verspannungen und verbessern die Körperhaltung. Die Übungen sind für Anfänger und Fortgeschrittene gleichermaßen geeignet.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (11, 4);

INSERT INTO contents (id, title, slug, subtitle, description, date, url, image) VALUES (
  12,
  'Fayo Retreat',
  'fayo-retreat',
  null,
  'Jeden zweiten Donnerstag von 18:00 bis 19:30 Uhr finden Sie mich in der Schreibwerkstatt und können an meinen Workshops teilnehmen.',
  null,
  'https://google.com',
  'header-placeholder.jpg'
);
INSERT INTO contentCategories (contentId, categoryId) VALUES (12, 4);

-- Theme
INSERT INTO theme (id, primaryColor, primaryColorHover) VALUES (1, '#8b0836', '#b6325e');

-- Sections
INSERT INTO sections (id, name, component, contentId, categoryId, orderIndex) VALUES (1, 'Header', 'Header', 1, null, 1);
INSERT INTO sections (id, name, component, contentId, categoryId, orderIndex) VALUES (2, 'About', 'About', 2, null, 2);
INSERT INTO sections (id, name, component, contentId, categoryId, orderIndex) VALUES (3, 'Prices', 'Prices', null, 3, 3);
INSERT INTO sections (id, name, component, contentId, categoryId, orderIndex) VALUES (4, 'Events', 'Events', null, 4, 4);
INSERT INTO sections (id, name, component, contentId, categoryId, orderIndex) VALUES (5, 'Contact', 'Contact', null, null, 5);
INSERT INTO sections (id, name, component, contentId, categoryId, orderIndex) VALUES (6, 'Footer', 'Footer', null, null, 6);