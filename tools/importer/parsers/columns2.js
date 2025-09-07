/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Defensive: find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the three main blocks: image/logo, navigation, search
  const imageCol = getChildByClass(grid, 'image');
  const navCol = getChildByClass(grid, 'navigation');
  const searchCol = getChildByClass(grid, 'search');

  // Defensive: get logo image block
  let logoBlock = null;
  if (imageCol) {
    // The logo is inside the first child div (with data-cmp-is="image")
    logoBlock = imageCol.firstElementChild;
  }

  // Defensive: get navigation block (may be missing)
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.firstElementChild;
  }

  // Defensive: get search block
  let searchBlock = null;
  if (searchCol) {
    searchBlock = searchCol.firstElementChild;
  }

  // Compose columns: always logo, then navigation (if present), then search
  // For 2-column: logo | search
  // For 3-column: logo | navigation | search
  const columns = [];
  if (logoBlock) columns.push(logoBlock);
  if (navBlock) columns.push(navBlock);
  if (searchBlock) columns.push(searchBlock);

  // Table header
  const headerRow = ['Columns (columns2)'];
  // Table body: one row, N columns
  const bodyRow = columns;

  const cells = [headerRow, bodyRow];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
