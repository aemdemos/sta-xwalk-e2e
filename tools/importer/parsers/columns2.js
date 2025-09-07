/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get immediate children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // Find the logo image block (always first column)
  const logoCol = columns.find(col => col.classList.contains('image'));
  // Defensive: get the logo image element
  let logoBlock = null;
  if (logoCol) {
    // The logo is the inner div with class 'cmp-image'
    logoBlock = logoCol.querySelector('.cmp-image');
  }

  // Find the navigation block (middle column, may be missing)
  const navCol = columns.find(col => col.classList.contains('navigation'));
  let navBlock = null;
  if (navCol) {
    // The navigation is the nav element
    navBlock = navCol.querySelector('nav');
  }

  // Find the search block (always last column)
  const searchCol = columns.find(col => col.classList.contains('search'));
  let searchBlock = null;
  if (searchCol) {
    // The search is the section element
    searchBlock = searchCol.querySelector('section');
  }

  // Build the header row
  const headerRow = ['Columns (columns2)'];

  // Build the columns row
  // If navigation is missing, only 2 columns
  let contentRow;
  if (navBlock) {
    contentRow = [logoBlock, navBlock, searchBlock];
  } else {
    contentRow = [logoBlock, searchBlock];
  }

  // Compose the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
