/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the hero content wrapper
  // The main content is inside: element > .hero-wrapper > .hero.block > div > div
  let contentDiv = element;
  // Traverse down to the actual content div
  // Defensive: check for .hero-wrapper
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (heroWrapper) {
    const heroBlock = heroWrapper.querySelector('.hero.block');
    if (heroBlock) {
      // The actual content is inside heroBlock > div > div
      const outerDiv = heroBlock.querySelector('div');
      if (outerDiv) {
        const innerDiv = outerDiv.querySelector('div');
        if (innerDiv) {
          contentDiv = innerDiv;
        } else {
          contentDiv = outerDiv;
        }
      } else {
        contentDiv = heroBlock;
      }
    } else {
      contentDiv = heroWrapper;
    }
  }

  // Compose the table rows
  const headerRow = ['Table (striped, bordered, tableStripedBordered2)'];

  // The content row should contain the entire hero content (image + heading)
  // Defensive: collect all direct children of contentDiv
  const contentChildren = Array.from(contentDiv.childNodes).filter(node => {
    // Only include elements or non-empty text nodes
    return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
  });

  // If there are no children, fallback to the whole contentDiv
  const contentRow = [contentChildren.length ? contentChildren : [contentDiv]];

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
