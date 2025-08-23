/* global WebImporter */
export default function parse(element, { document }) {
  // The top-level element is a wrapper for the columns block.
  // Find the actual columns block inside
  const block = element.querySelector(':scope > .columns.block');
  if (!block) return;
  // Each immediate child <div> of .columns.block is a row for the table
  const rows = Array.from(block.children);
  // Prepare the block table cells array
  const cells = [];
  // Header: always use block name exactly as specified
  cells.push(['Columns']);
  // For each row, collect the columns (cells)
  for (const row of rows) {
    // Each column is a child <div> of the row <div>
    const cols = Array.from(row.children);
    const rowCells = cols.map((col) => {
      // If the column <div> has only one child, use it directly
      if (col.children.length === 1) {
        return col.firstElementChild;
      }
      // If multiple children, return all as array
      return Array.from(col.children);
    });
    cells.push(rowCells);
  }
  // Create the block table using referenced elements
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the wrapper with the new table
  element.replaceWith(table);
}
