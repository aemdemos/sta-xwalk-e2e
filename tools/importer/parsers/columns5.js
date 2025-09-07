/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container (holds columns)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all immediate children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Prepare the header row as required
  const headerRow = ['Columns (columns5)'];

  // Each column cell will contain the main content from that column
  // Only include columns that have visible content
  const contentRow = columns.map((col) => {
    // Defensive: If column is empty, skip
    if (!col || !col.firstElementChild) return '';
    // Use the actual first child (image, nav, or search)
    return col.firstElementChild;
  });

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
