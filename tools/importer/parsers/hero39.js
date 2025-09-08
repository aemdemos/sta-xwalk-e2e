/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block (could be the element itself)
  const teaser = element.querySelector('.cmp-teaser') || element;

  // --- 1. HEADER ROW ---
  const headerRow = ['Hero (hero39)'];

  // --- 2. IMAGE ROW ---
  // Find the image container
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual <img> inside
    imageEl = imageWrapper.querySelector('img');
  }
  // If found, use the image element; else, leave cell empty
  const imageRow = [imageEl ? imageEl : ''];

  // --- 3. CONTENT ROW ---
  // Find the content container
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let contentElements = [];
  if (contentWrapper) {
    // Title (usually h2)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentElements.push(title);
    // Description (usually a <div> with <p>)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentElements.push(desc);
  }
  // If nothing found, leave cell empty
  const contentRow = [contentElements.length ? contentElements : ''];

  // --- 4. CREATE TABLE ---
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // --- 5. REPLACE ORIGINAL ELEMENT ---
  element.replaceWith(table);
}
