/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Use the required header row
  const headerRow = ['Columns (columns3)'];

  // Each direct child <div> of .columns.block is a row in the columns block
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  const tableRows = [];

  rows.forEach((row) => {
    // Each row has two columns
    const cols = Array.from(row.children);
    const cells = cols.map((col) => {
      // If this column is an image column, use the <picture> element
      if (col.classList.contains('columns-img-col')) {
        const picture = col.querySelector('picture');
        if (picture) return picture;
        // fallback: if no picture, return the column itself
        return col;
      }
      // Otherwise, return the column itself (text, lists, buttons, etc)
      return col;
    });
    tableRows.push(cells);
  });

  // Compose the table data
  const tableData = [headerRow, ...tableRows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
