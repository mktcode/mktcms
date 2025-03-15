CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  domain TEXT,
  email TEXT,
  googleManagerId TEXT NOT NULL,
  password TEXT,
  isOnline BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS companies (
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  street TEXT,
  zip TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  vat TEXT,
  logo TEXT,
  isSmallBusiness BOOLEAN NOT NULL DEFAULT 1,
);

CREATE TABLE IF NOT EXISTS vcards (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  userId INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  slogan TEXT,
  street TEXT,
  zip TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  hasBack BOOLEAN NOT NULL DEFAULT 0,
  backLogo BOOLEAN NOT NULL DEFAULT 0,
  backTitle TEXT,
  backText TEXT
);

CREATE TABLE IF NOT EXISTS websites (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  userId INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  domain TEXT,
  path TEXT,
  image TEXT
  isOnline BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  zip TEXT,
  city TEXT,
  phone TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  zip TEXT,
  city TEXT,
  phone TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS invoices_out (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  customerId INTEGER NOT NULL,
  date TIMESTAMP,
  status INTEGER NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS invoices_in (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  supplierId INTEGER NOT NULL,
  date TIMESTAMP,
  status INTEGER NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT
);

CREATE TABLE IF NOT EXISTS invoice_item_relations (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  invoiceId INTEGER NOT NULL,
  itemId INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS contents (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  userId INTEGER NOT NULL,
  parentId INTEGER,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  date TIMESTAMP,
  url TEXT,
  image TEXT,
  orderIndex INTEGER NOT NULL DEFAULT 0
);