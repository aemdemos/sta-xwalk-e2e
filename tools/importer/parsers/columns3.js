/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell with 'Columns'
  const headerRow = ['Columns'];

  // Find all rows (immediate children of the block)
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each row, extract its columns (immediate children divs)
  const tableRows = rowDivs.map(rowDiv => {
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    return colDivs.map(col => {
      // If this is a column image wrapper, use the <picture> directly
      if (
        col.classList.contains('columns-img-col') &&
        col.children.length === 1 &&
        col.children[0].tagName.toLowerCase() === 'picture'
      ) {
        return col.children[0];
      }
      // Otherwise, use the full column content
      return col;
    });
  });

  // Build the table data: header is always a single cell, then each row as array of columns
  const tableData = [headerRow, ...tableRows];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
