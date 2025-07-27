/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) {
    if (element.classList.contains('columns') && element.classList.contains('block')) {
      columnsBlock = element;
    } else {
      // fallback: just the header if nothing matches
      const block = WebImporter.DOMUtils.createTable([['Columns']], document);
      element.replaceWith(block);
      return;
    }
  }

  // Find row containers
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // Collect content rows (each row is an array of columns)
  const contentRows = rowDivs.map(rowDiv => {
    // Each immediate child <div> is a column
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    return colDivs.map(colDiv => {
      // Get all non-empty child nodes
      const nodes = Array.from(colDiv.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      if (nodes.length === 0) return '';
      if (nodes.length === 1) return nodes[0];
      return nodes;
    });
  });

  // Determine max number of columns in any content row
  const maxCols = contentRows.reduce((max, row) => Math.max(max, row.length), 0);

  // Pad all rows to have maxCols columns
  const paddedRows = contentRows.map(row => {
    if (row.length < maxCols) {
      return row.concat(Array(maxCols - row.length).fill(''));
    }
    return row;
  });

  // Table header row: must be a single cell (exactly one column)
  const headerRow = ['Columns'];
  const tableRows = [headerRow, ...paddedRows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
