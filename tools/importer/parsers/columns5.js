/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the actual footer content
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Helper to find a child by class
  function findByClass(cls) {
    return columns.find(col => col.classList.contains(cls));
  }

  // Column 1: Logo
  const logoCol = findByClass('image');
  let logoContent = '';
  if (logoCol) {
    const logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoBlock) logoContent = logoBlock.cloneNode(true);
  }

  // Column 2: Navigation
  const navCol = findByClass('navigation');
  let navContent = '';
  if (navCol) {
    const navBlock = navCol.querySelector('nav');
    if (navBlock) navContent = navBlock.cloneNode(true);
  }

  // Column 3: Follow Us title
  const titleCol = findByClass('title');
  let titleContent = '';
  if (titleCol) {
    const titleBlock = titleCol.querySelector('.cmp-title');
    if (titleBlock) titleContent = titleBlock.cloneNode(true);
  }

  // Column 4: Social buttons
  const btnCol = findByClass('buildingblock');
  let btnContent = '';
  if (btnCol) {
    const btnGrid = btnCol.querySelector('.aem-Grid');
    if (btnGrid) btnContent = btnGrid.cloneNode(true);
  }

  // Column 5: Footer text (all text blocks, preserve anchors and all HTML attributes)
  const textCols = columns.filter(col => col.classList.contains('text'));
  let textContent = [];
  if (textCols.length) {
    textContent = textCols.map(tc => {
      const block = tc.querySelector('.cmp-text');
      if (!block) return '';
      // Instead of cloneNode, use the actual block node (which preserves all anchor tags and attributes)
      // But to ensure all attributes and links are preserved, we must use the original node, not a new div or innerHTML
      return block;
    }).filter(Boolean);
  }

  // Compose the columns row
  const columnsRow = [
    logoContent,
    navContent,
    [titleContent, btnContent], // Combine title and buttons in one cell
    textContent // Combine all text blocks in one cell
  ];

  // Table header
  const headerRow = ['Columns (columns5)'];

  // Build the table
  const cells = [
    headerRow,
    columnsRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
