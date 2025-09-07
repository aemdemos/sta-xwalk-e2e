/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first descendant with a class
  function findDescendantByClass(root, className) {
    return root.querySelector(`.${className}`);
  }

  // Find the deepest grid container with the actual footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) {
    // Defensive: fallback to any .aem-Grid
    grid = element.querySelector('.aem-Grid');
  }
  if (!grid) {
    // If not found, fallback to the element itself
    grid = element;
  }

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children).filter(child => {
    // Only keep visible content columns (ignore separators, etc.)
    // We'll keep .image, .navigation, .title, .buildingblock, .text
    return [
      'image',
      'navigation',
      'title',
      'buildingblock',
      'text',
    ].some(cls => child.classList.contains(cls));
  });

  // Compose the columns for the main row
  // Visual order: logo (image), navigation, follow us (title+buttons), copyright (text)
  // For the 'follow us' column, combine the title and the button list
  const cells = [];

  // 1. Logo column (image)
  const logoCol = columns.find(col => col.classList.contains('image'));
  let logoContent = null;
  if (logoCol) {
    // Use the inner image/link block
    logoContent = logoCol.firstElementChild;
  }

  // 2. Navigation column
  const navCol = columns.find(col => col.classList.contains('navigation'));
  let navContent = null;
  if (navCol) {
    navContent = navCol.firstElementChild;
  }

  // 3. Follow Us column (title + buildingblock)
  const titleCol = columns.find(col => col.classList.contains('title'));
  const btnCol = columns.find(col => col.classList.contains('buildingblock'));
  let followContent = [];
  if (titleCol) followContent.push(titleCol.firstElementChild);
  if (btnCol) followContent.push(btnCol.firstElementChild);
  if (followContent.length === 1) followContent = followContent[0];
  if (followContent.length === 0) followContent = null;

  // 4. Copyright/text column
  const textCol = columns.find(col => col.classList.contains('text'));
  let textContent = null;
  if (textCol) {
    textContent = textCol.firstElementChild;
  }

  // Compose the row in the correct order (logo, nav, follow, text)
  const row = [logoContent, navContent, followContent, textContent];

  // Remove any undefined/null columns at the end (defensive, but all should exist)
  while (row.length && !row[row.length - 1]) row.pop();

  // Table header
  const headerRow = ['Columns (columns5)'];
  const tableRows = [headerRow, row];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
