/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero-wrapper inside the element
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (!heroWrapper) return;

  // Find the main hero block
  const heroBlock = heroWrapper.querySelector('.hero.block');
  if (!heroBlock) return;

  // The main content is the first child div's first child div
  // This is typical for these hero implementations
  let contentDiv = heroBlock;
  // Descend two levels to the real content
  if (contentDiv.children.length > 0 && contentDiv.children[0].children.length > 0) {
    contentDiv = contentDiv.children[0].children[0];
  } else {
    return;
  }

  // Find the picture (background image)
  let imageEl = null;
  const firstP = contentDiv.querySelector('p');
  if (firstP && firstP.querySelector('picture')) {
    imageEl = firstP.querySelector('picture');
  }

  // Collect content after the image (usually h1/h2, p, etc)
  const contentNodes = [];
  let next = firstP ? firstP.nextElementSibling : contentDiv.firstElementChild;
  while (next) {
    // Only add if not empty (sometimes empty p's)
    if (next.textContent.trim() !== '' || next.querySelector('a')) {
      contentNodes.push(next);
    }
    next = next.nextElementSibling;
  }

  // Build the table, referencing real elements from the DOM
  const headerRow = ['Hero'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [contentNodes.length ? contentNodes : ''];
  const cells = [headerRow, imageRow, textRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
