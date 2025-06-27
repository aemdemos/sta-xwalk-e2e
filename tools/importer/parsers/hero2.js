/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block - support both .hero.block and fallback to element
  let heroBlock = element.querySelector('.hero.block') || element;

  // The main content is usually deeply nested
  let innerDiv = heroBlock;
  // Drill down to innermost div if needed
  while (
    innerDiv.children.length === 1 &&
    innerDiv.children[0].tagName === 'DIV'
  ) {
    innerDiv = innerDiv.children[0];
  }

  // 1. Extract the image (picture inside a <p>), or empty string if not found
  let imgCell = '';
  const picP = Array.from(innerDiv.children).find(child => {
    return child.tagName === 'P' && child.querySelector('picture, img');
  });
  if (picP) {
    imgCell = picP;
  }

  // 2. Extract the content for 3rd row: all heading and non-empty paragraphs after the image row
  let afterImg = false;
  let contentCellFragments = [];
  for (const child of innerDiv.children) {
    if (child === picP) {
      afterImg = true;
      continue;
    }
    if (!afterImg) continue;
    if (
      child.tagName &&
      (/^H[1-6]$/.test(child.tagName) || (child.tagName === 'P' && child.textContent.trim() !== ''))
    ) {
      contentCellFragments.push(child);
    }
  }
  // Fallback: if nothing after image, but there are headings or non-empty paragraphs before, include them.
  if (contentCellFragments.length === 0) {
    contentCellFragments = Array.from(innerDiv.children).filter(
      el =>
        /^H[1-6]$/.test(el.tagName) || (el.tagName === 'P' && el.textContent.trim() !== '')
    );
    // Remove the image row if it's included
    if (imgCell && contentCellFragments[0] === imgCell) {
      contentCellFragments.shift();
    }
  }

  // Build the table: header 'Hero', image row, then content row
  const table = WebImporter.DOMUtils.createTable([
    ['Hero'],
    [imgCell],
    [contentCellFragments]
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
