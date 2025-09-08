/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all top-level grid columns (logo, navigation, search)
  const columns = Array.from(grid.children);

  // Prepare cells for the columns block
  // Always 3 columns: logo, navigation, search
  // Defensive: fallback to empty div if missing
  const logoCol = columns.find(col => col.classList.contains('image')) || document.createElement('div');
  const navCol = columns.find(col => col.classList.contains('navigation')) || document.createElement('div');
  const searchCol = columns.find(col => col.classList.contains('search')) || document.createElement('div');

  // Table header row
  const headerRow = ['Columns (columns2)'];
  // Table content row: 3 columns
  const contentRow = [logoCol, navCol, searchCol];

  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
