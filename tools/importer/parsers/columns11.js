/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the actual footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children).filter((col) => {
    // Only include columns that have meaningful content
    // Exclude separators or empty columns
    return !col.classList.contains('cmp-separator--hidden');
  });

  // The visual layout is always 2 columns:
  //  - Left: logo + navigation
  //  - Right: follow us title + social buttons
  // The copyright text is always full width below

  // Find logo (image block)
  const logoCol = columns.find(col => col.querySelector('.cmp-image'));
  // Find navigation (nav block)
  const navCol = columns.find(col => col.querySelector('.cmp-navigation'));
  // Find follow us title
  const titleCol = columns.find(col => col.querySelector('.cmp-title'));
  // Find social buttons (buildingblock)
  const btnCol = columns.find(col => col.querySelector('.cmp-buildingblock--btn-list'));
  // Find copyright text
  const textCol = columns.find(col => col.querySelector('.cmp-text'));

  // Compose left column: logo + navigation
  const leftColContent = [];
  if (logoCol) {
    const img = logoCol.querySelector('.cmp-image');
    if (img) leftColContent.push(img);
  }
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) leftColContent.push(nav);
  }

  // Compose right column: follow us + social buttons
  const rightColContent = [];
  if (titleCol) {
    const title = titleCol.querySelector('.cmp-title');
    if (title) rightColContent.push(title);
  }
  if (btnCol) {
    const btnGrid = btnCol.querySelector('.aem-Grid');
    if (btnGrid) rightColContent.push(btnGrid);
  }

  // Compose copyright row (should only be one cell, no unnecessary empty column)
  let copyrightContent = [];
  if (textCol) {
    const text = textCol.querySelector('.cmp-text');
    if (text) copyrightContent.push(text);
  }

  // Build the table
  const headerRow = ['Columns (columns11)'];
  const contentRow = [leftColContent, rightColContent];
  const copyrightRow = [copyrightContent]; // Only one cell, no extra empty column

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
    copyrightRow,
  ], document);

  element.replaceWith(table);
}
