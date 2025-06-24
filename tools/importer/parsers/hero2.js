/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block's main content container
  let contentContainer = element;
  const heroBlock = element.querySelector('.hero.block');
  if (heroBlock) {
    const innerDiv = heroBlock.querySelector('div > div');
    if (innerDiv) {
      contentContainer = innerDiv;
    }
  }

  // Find the picture/image row
  let imgRow = '';
  const firstPicture = contentContainer.querySelector('picture');
  if (firstPicture) {
    const picP = firstPicture.closest('p');
    if (picP) {
      imgRow = picP;
    } else {
      imgRow = firstPicture;
    }
  }

  // Gather all content rows except the picture's parent <p> (if any)
  const contentRows = [];
  Array.from(contentContainer.children).forEach((child) => {
    // skip the image row
    if (imgRow && child === imgRow) return;
    // skip empty paragraphs
    if (child.tagName === 'P' && !child.textContent.trim()) return;
    contentRows.push(child);
  });

  // Compose the table as per the markdown example
  // 1. Header row with block name exactly as in the example
  // 2. Second row: image (or empty, if none)
  // 3. Third row: all remaining content (can be empty)
  const rows = [
    ['Hero'],
    [imgRow || ''],
    [contentRows.length ? contentRows : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
