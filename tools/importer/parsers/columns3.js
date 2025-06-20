/* global WebImporter */
export default function parse(element, { document }) {
  // The header must exactly match the block name/variant
  const headerRow = ['Columns (columns3)'];

  // Find all immediate children of the block (should be rows of columns)
  const columnRows = Array.from(element.querySelectorAll(':scope > div'));
  const cells = [headerRow];

  for (const row of columnRows) {
    // The columns in each row are the direct children of the row-div
    const columns = Array.from(row.children);
    // For each column, add it directly (reference, not clone)
    if (columns.length > 0) {
      cells.push(columns);
    }
  }

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
