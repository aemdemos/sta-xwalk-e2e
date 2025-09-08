/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content and image containers
  const content = element.querySelector('.cmp-teaser__content');
  const imageContainer = element.querySelector('.cmp-teaser__image');

  // Find the image element (if present)
  let imageEl = null;
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Compose the content cell: title, description, CTA
  const contentParts = [];
  if (content) {
    // Title (as heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      // Use <h1> for hero block title
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      contentParts.push(h1);
    }
    // Description (as paragraph)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      const p = document.createElement('p');
      p.innerHTML = desc.innerHTML;
      contentParts.push(p);
    }
    // CTA (as link)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentParts.push(cta);
    }
  }

  // Build the table rows
  const headerRow = ['Hero (hero28)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentParts];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
