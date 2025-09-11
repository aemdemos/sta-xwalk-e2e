/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct child divs (each row)
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  if (rows.length === 0) return;

  // Header row as per requirements
  const headerRow = ['Columns (columns3)'];
  const tableRows = [headerRow];

  // For each row, build a table row with as many columns as there are direct children
  rows.forEach((row) => {
    // Each row contains columns as direct children
    const cols = Array.from(row.children);
    // For each column, collect its content
    const cells = cols.map((col) => {
      // If the column has only one child and it's a wrapper (like .columns-img-col), use its content
      if (col.children.length === 1 && col.firstElementChild && col.classList.contains('columns-img-col')) {
        return col.firstElementChild;
      }
      // Otherwise, return the column itself (which may contain text, lists, buttons, etc)
      return col;
    });
    tableRows.push(cells);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(block);
}
