/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero28)'];

  // 2. Image row: extract the <img> element from the hero image
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image img');
  if (imageContainer) {
    imageEl = imageContainer.cloneNode(true);
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row: extract title, description, and CTA as block content
  const contentParts = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title.textContent.trim();
      contentParts.push(h2);
    }
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentParts.push(p);
    }
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentParts.push(cta.cloneNode(true));
    }
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // 4. Build table and replace
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
