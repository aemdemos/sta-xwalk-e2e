/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .columns.block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all immediate child divs (each is a row)
  const rows = Array.from(columnsBlock.children).filter(child => child.tagName === 'DIV');
  if (rows.length === 0) return;

  // Determine number of columns from the first row
  const firstRowCols = Array.from(rows[0].children).filter(child => child.tagName === 'DIV');
  const numCols = firstRowCols.length;

  // Helper to extract content for a column cell
  function getCellContent(cellDiv) {
    if (cellDiv.classList.contains('columns-img-col')) {
      const picture = cellDiv.querySelector('picture');
      if (picture) return picture;
      return cellDiv;
    }
    return cellDiv;
  }

  // Header row: one cell with 'Columns'
  const cells = [['Columns']];

  // Each row: array of column cells for each row
  rows.forEach(rowDiv => {
    const colDivs = Array.from(rowDiv.children).filter(child => child.tagName === 'DIV');
    const colContents = colDivs.map(getCellContent);
    // Only push if colContents is not empty
    if (colContents.length > 0) {
      cells.push(colContents);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
