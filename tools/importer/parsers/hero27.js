/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // --- HEADER ROW ---
  const headerRow = ['Hero (hero27)'];

  // --- IMAGE ROW ---
  // Find the image element
  let imageRow;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual <img> inside
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageRow = [img];
    } else {
      imageRow = [''];
    }
  } else {
    imageRow = [''];
  }

  // --- CONTENT ROW ---
  const contentParts = [];
  // Title as heading
  const title = teaser.querySelector('.cmp-teaser__title');
  if (title) {
    const h2 = document.createElement('h2');
    h2.innerHTML = title.innerHTML;
    contentParts.push(h2);
  }
  // Description as paragraph
  const desc = teaser.querySelector('.cmp-teaser__description');
  if (desc) {
    const p = document.createElement('p');
    p.innerHTML = desc.innerHTML;
    contentParts.push(p);
  }
  // CTA link
  const ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
  if (ctaContainer) {
    const ctaLink = ctaContainer.querySelector('a');
    if (ctaLink) {
      contentParts.push(ctaLink);
    }
  }
  const contentRow = [contentParts];

  // --- TABLE CREATION ---
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
