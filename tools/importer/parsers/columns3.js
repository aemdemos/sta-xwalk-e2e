/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all immediate child divs of the columns block (each is a row of columns)
  const rows = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // Prepare header row
  const headerRow = ['Columns (columns3)'];

  // Prepare content rows
  const contentRows = [];

  // Each row in the source HTML is visually a row in the columns block
  rows.forEach((rowDiv) => {
    // Each rowDiv contains 2 child divs (columns)
    const cols = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // Defensive: If there are no direct child divs, treat the rowDiv itself as a column
    let cells;
    if (cols.length > 0) {
      cells = cols.map((colDiv) => {
        // If this column is just an image column, use the image/picture directly
        const imgCol = colDiv.classList.contains('columns-img-col');
        if (imgCol) {
          // Find the picture element
          const picture = colDiv.querySelector('picture');
          if (picture) return picture;
          // Fallback: if no picture, return the colDiv itself
          return colDiv;
        }
        // Otherwise, use the full column div (contains text, lists, buttons, etc.)
        return colDiv;
      });
    } else {
      // Fallback: treat the rowDiv itself as a single column
      cells = [rowDiv];
    }
    contentRows.push(cells);
  });

  // Ensure all content rows have the same number of columns (pad with empty string if needed)
  const maxCols = Math.max(...contentRows.map(r => r.length));
  contentRows.forEach(row => {
    while (row.length < maxCols) row.push('');
  });

  // Compose the table
  const tableCells = [headerRow, ...contentRows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(table);
}
