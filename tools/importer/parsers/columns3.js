/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner block that holds the columns
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all direct child divs of the columns.block (each represents a row of columns)
  const rowDivs = Array.from(columnsBlock.children);

  if (rowDivs.length === 0) return;
  // Determine the maximum number of columns in any row for table structure
  let maxCols = 0;
  rowDivs.forEach(rowDiv => {
    const colDivs = Array.from(rowDiv.children);
    if (colDivs.length > maxCols) maxCols = colDivs.length;
  });

  // Build rows for the table
  const tableRows = [];
  // Header row: exactly one cell with the block name
  tableRows.push(['Columns']);

  // For each row, add the correct number of columns (as many as maxCols)
  rowDivs.forEach(rowDiv => {
    const colDivs = Array.from(rowDiv.children);
    const rowCells = [];
    for (let i = 0; i < maxCols; i++) {
      if (colDivs[i]) {
        // Gather all content from colDivs[i]
        const content = [];
        Array.from(colDivs[i].childNodes).forEach(node => {
          if (
            node.nodeType === Node.ELEMENT_NODE ||
            (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
          ) {
            content.push(node);
          }
        });
        if (content.length === 1) rowCells.push(content[0]);
        else if (content.length > 1) rowCells.push(content);
        else rowCells.push('');
      } else {
        // Fill missing cells with empty string for correct # cols
        rowCells.push('');
      }
    }
    tableRows.push(rowCells);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
