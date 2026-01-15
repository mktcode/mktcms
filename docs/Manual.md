# Developer Manual

Unlike “classic” CMS platforms that optimize for breadth (themes, plugins, one-click customization), this CMS is optimized for building bespoke websites with a controlled editing surface.

It is not meant to replace designers and developers. It is a tool to help you ship tailor-made projects while exposing only the minimum set of content your client should be able to change—without a bloated admin UI.

## Only agreed content is editable

You decide exactly which parts of a site are editable.

Practically, this means: if there is no corresponding file or folder in the content tree, the client cannot edit it.
If a piece of content should become editable later, you add it to the content structure.

This encourages a deliberate workflow:

- Designers define what must be editable.
- Developers map those decisions to files/folders.
- Editors only see what you prepared.

## File-manager first

The entire admin experience is essentially a file manager.

If you want the homepage text to be editable, you place a file at the appropriate location (for example `Text-Homepage.txt`) that contains only that text.
If the site has an image gallery, you typically provide a folder like `Gallery/` or `Images/` where editors can upload, replace, or delete images.

From a project-structure perspective:

- Files represent editable content values.
- Folders represent editable collections (galleries, downloads, product lists, etc.).

## File formats

For more structured or rich content, you can choose formats that match the editing experience you want to provide.

### Plain text (.txt)

Use plain text files for the smallest possible text blocks: titles, short descriptions, button labels, disclaimers, SEO snippets, etc.
In the admin UI, `.txt` files open in a simple text editor.

Guidelines:

- Prefer one value per file (treat the file content as the value).
- Decide whether multi-line content is allowed; if not, enforce single-line usage in your project conventions.
- Be explicit in your frontend about trimming/normalizing whitespace and line breaks.

### Markdown (.md)

Use Markdown when you want editors to manage rich text.
In the admin UI, Markdown files open in a Markdown editor (preview + source), so editors can format text, add links, and embed images without touching your templates.

Typical patterns:

- One Markdown file per page/section (e.g. `about.md`, `hero.md`, `privacy.md`).
- Reference images by relative path within the same folder.

When designing components, decide which Markdown features you will support (headings, lists, tables, etc.) and keep that consistent across the project.

### CSV (.csv)

Use CSV when editors should maintain a list or table (team members, locations, FAQs, price lists, etc.).
In the admin UI, CSV files open as a form/table: each column becomes a field, each row becomes an entry.

Guidelines:

- Treat the header row as the stable API between editors and your frontend.
- Keep column names predictable (no frequent renames) to avoid breaking consumers.
- Decide whether order matters (if yes, render in file order).

### JSON (.json)

Use JSON when you want a strict, schema-like editing surface (objects/arrays/flags), for example product data, complex component props, or configuration-like content.

Guidelines:

- Keep JSON files small and focused (one concern per file).
- Treat the JSON shape as a contract; version it deliberately if the frontend depends on it.
- Prefer referencing assets (image filenames/paths) instead of embedding large blobs.