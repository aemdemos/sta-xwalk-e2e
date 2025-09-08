/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero teaser block
  const teaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!teaser) return;

  // Find the image element inside the teaser
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Compose the content cell for the third row: title, subheading, CTA (all in one cell)
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  const contentCell = document.createElement('div');
  if (contentContainer) {
    // Title (heading)
    const headingEl = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    if (headingEl) contentCell.appendChild(headingEl.cloneNode(true));
    // Subheading (if present)
    const subheadingEl = contentContainer.querySelector('p');
    if (subheadingEl) contentCell.appendChild(subheadingEl.cloneNode(true));
    // CTA (if present)
    const ctaEl = contentContainer.querySelector('a');
    if (ctaEl) contentCell.appendChild(ctaEl.cloneNode(true));
  }
  // Always provide a third row, even if empty
  let contentRow;
  if (contentCell.childNodes.length) {
    // Place all children in a single cell (as an array)
    contentRow = [Array.from(contentCell.childNodes)];
  } else {
    contentRow = [''];
  }

  // Compose the table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl ? imageEl : ''];

  // Create the table block
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
