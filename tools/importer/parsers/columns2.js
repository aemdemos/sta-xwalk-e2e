/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the grid container (should be only one)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the three main columns: logo, navigation, search
  const logoCol = getDirectChildByClass(grid, 'image');
  const navCol = getDirectChildByClass(grid, 'navigation');
  const searchCol = getDirectChildByClass(grid, 'search');

  // Defensive: If any are missing, fallback to empty
  const logoBlock = logoCol ? logoCol : document.createElement('div');
  const navBlock = navCol ? navCol : document.createElement('div');
  const searchBlock = searchCol ? searchCol : document.createElement('div');

  // Compose columns for the block table
  // If navigation is visually missing (as in first two screenshots), use only logo and search
  let columns = [];
  if (navCol && navCol.querySelector('nav')) {
    columns = [logoBlock, navBlock, searchBlock];
  } else {
    columns = [logoBlock, searchBlock];
  }

  // Table header
  const headerRow = ['Columns (columns2)'];
  // Table content row(s)
  const contentRow = columns;

  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
