/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the columns-wrapper block
  if (!element || !element.classList.contains('columns-wrapper')) return;

  // Block header must match target block name exactly
  const headerRow = ['Columns (columns3)'];

  // Find the columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each direct child of columnsBlock is a row (two rows)
  const rows = Array.from(columnsBlock.children);
  const tableRows = [];

  rows.forEach((row) => {
    // Each row contains two columns (divs)
    const cols = Array.from(row.children);
    const rowCells = cols.map((col) => {
      // If column is an image column, extract the image
      if (col.classList.contains('columns-img-col')) {
        const picture = col.querySelector('picture');
        if (picture) return picture;
        const img = col.querySelector('img');
        if (img) return img;
        return col; // fallback
      }
      // Otherwise, return the column as-is (text, list, button, etc)
      return col;
    });
    tableRows.push(rowCells);
  });

  // Compose table: header + rows
  const cells = [headerRow, ...tableRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the wrapper with the table
  element.replaceWith(table);
}
