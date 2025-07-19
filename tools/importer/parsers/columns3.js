/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual columns block if a wrapper is given
  let columnsBlock = element;
  if (!columnsBlock.classList.contains('columns') || !columnsBlock.classList.contains('block')) {
    const found = element.querySelector('.columns.block');
    if (found) columnsBlock = found;
  }
  // Each direct DIV child of columnsBlock represents a row in this layout
  const rows = Array.from(columnsBlock.children).filter(child => child.tagName === 'DIV');
  // Prepare the table header row
  const headerRow = ['Columns'];
  const tableRows = [headerRow];

  // For each row, build the array of cells for this table row.
  rows.forEach(rowDiv => {
    // Each direct DIV child of the rowDiv is a column
    const columnDivs = Array.from(rowDiv.children).filter(child => child.tagName === 'DIV');
    // If there are no inner DIVs, treat the rowDiv itself as a single column
    let rowCells;
    if (columnDivs.length > 0) {
      rowCells = columnDivs.map(colDiv => colDiv);
    } else {
      rowCells = [rowDiv];
    }
    tableRows.push(rowCells);
  });

  // Create the block table and replace the original columns block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  columnsBlock.replaceWith(table);
}
