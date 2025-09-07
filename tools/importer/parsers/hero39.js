/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');

  // Get the image element (background image)
  let imageCell = '';
  const imageWrapper = teaser && teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual <img> inside
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Get the content (title, description, etc.)
  let contentCell = '';
  const contentWrapper = teaser && teaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // We'll collect all children (h2, description, etc.) into a fragment
    const frag = document.createDocumentFragment();
    // Title (h2)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) {
      frag.appendChild(title);
    }
    // Description (may be a div with <p>)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      frag.appendChild(desc);
    }
    contentCell = frag;
  }

  // Build the table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageCell];
  const contentRow = [contentCell];
  const cells = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
