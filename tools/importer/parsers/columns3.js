/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct children divs
  const getDirectDivs = (el) => Array.from(el.children).filter((c) => c.tagName === 'DIV');

  // The header row as specified
  const headerRow = ['Columns (columns3)'];

  // Find the main columns block (should be the first child of columns-wrapper)
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) {
    // fallback: maybe the element itself is the columns block
    columnsBlock = element;
  }

  // Get the top-level rows (each row is a div)
  const rowDivs = getDirectDivs(columnsBlock);

  // Defensive: if no rows, fallback to children of element
  const rows = rowDivs.length ? rowDivs : getDirectDivs(element);

  // We'll collect all rows after the header
  const tableRows = [];

  // For each row (which is a div), extract its columns (also divs)
  rows.forEach((rowDiv) => {
    const colDivs = getDirectDivs(rowDiv);
    // Defensive: if no columns, treat the rowDiv as a single column
    const cols = colDivs.length ? colDivs : [rowDiv];
    // For each column, collect its content (all children)
    const cells = cols.map((col) => {
      // If the column is an image column, just return the picture/img
      const imgCol = col.classList.contains('columns-img-col');
      if (imgCol) {
        // Find the picture or img
        const picture = col.querySelector('picture');
        if (picture) return picture;
        const img = col.querySelector('img');
        if (img) return img;
      }
      // Otherwise, return all children as an array
      const children = Array.from(col.childNodes).filter((n) => {
        // skip empty text nodes
        return n.nodeType !== Node.TEXT_NODE || n.textContent.trim().length > 0;
      });
      if (children.length === 1) return children[0];
      if (children.length > 1) return children;
      // fallback: empty string
      return '';
    });
    tableRows.push(cells);
  });

  // Find the max number of columns for all rows (for padding)
  const maxCols = tableRows.reduce((max, row) => Math.max(max, row.length), 0);
  // Pad all rows to have the same number of columns
  tableRows.forEach((row) => {
    while (row.length < maxCols) {
      row.push('');
    }
  });

  // Compose the final table
  const cells = [headerRow, ...tableRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
