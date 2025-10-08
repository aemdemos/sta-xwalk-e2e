/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns3)'];

  // Find all direct child rows (each row is a direct child div)
  const rows = Array.from(element.children).filter((child) => child.tagName === 'DIV');

  // Defensive: Only process if there are at least two rows
  if (rows.length < 2) {
    // If not enough rows, fallback to single column layout
    const block = WebImporter.DOMUtils.createTable([
      headerRow,
      [element.cloneNode(true)]
    ], document);
    element.replaceWith(block);
    return;
  }

  // Build a 2x2 grid: two rows, two columns
  // Each row: extract only the direct child divs
  const tableRows = [headerRow];
  for (let i = 0; i < 2; i++) {
    const row = rows[i];
    let cells = [];
    if (row) {
      // Each column is a direct child div
      const cols = Array.from(row.children).filter((child) => child.tagName === 'DIV');
      // If there are more than 2 columns, only take the first two
      cells = [
        cols[0] ? cols[0].cloneNode(true) : '',
        cols[1] ? cols[1].cloneNode(true) : ''
      ];
    } else {
      cells = ['', ''];
    }
    tableRows.push(cells);
  }

  // Ensure exactly two rows and two columns for the 2x2 grid
  while (tableRows.length < 3) {
    tableRows.push(['', '']);
  }

  // Remove any extra columns if present (should only be 2 per row)
  tableRows.forEach((row, idx) => {
    if (idx > 0 && row.length > 2) {
      row.splice(2);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
