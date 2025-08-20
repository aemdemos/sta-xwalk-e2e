/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero block (contains hero content)
  const heroBlock = element.querySelector('.hero.block');
  let pictureEl = null;
  let contentEls = [];

  if (heroBlock) {
    // The hero block structure: .hero.block > div > div (content)
    const contentDiv = heroBlock.querySelector(':scope > div > div');
    if (contentDiv) {
      // Find <picture> element (background image)
      pictureEl = contentDiv.querySelector('picture');
      // Get all children except the <picture>
      contentEls = Array.from(contentDiv.children).filter(el => el !== pictureEl);
      // Filter out empty paragraphs, keep non-empty content
      contentEls = contentEls.filter(el => el.textContent.trim() !== '' || el.querySelector('*'));
    }
  }

  // 2. Build the table rows as per example
  const rows = [];
  rows.push(['Hero']); // Header row (block name, matches example)

  // 2nd row: background image (picture element or blank)
  if (pictureEl) {
    rows.push([pictureEl]);
  } else {
    rows.push(['']);
  }

  // 3rd row: headline, subheadline, cta, etc. (in their original elements)
  if (contentEls.length === 1) {
    rows.push([contentEls[0]]);
  } else if (contentEls.length > 1) {
    rows.push([contentEls]);
  } else {
    rows.push(['']);
  }

  // 3. Replace element with the table (do not return anything)
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
