/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual columns block
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) columnsBlock = element;

  // Get all immediate child divs of the columns block
  const rowDivs = Array.from(columnsBlock.children).filter((child) => child.tagName === 'DIV');

  // Each rowDiv contains the columns for that row
  // We'll create an array of arrays (each subarray is a row's columns)
  const contentRows = rowDivs.map(rowDiv => {
    // Each column is a direct child DIV
    const colDivs = Array.from(rowDiv.children).filter(col => col.tagName === 'DIV' || col.classList.contains('columns-img-col'));
    return colDivs.length ? colDivs : Array.from(rowDiv.children);
  });

  // Determine the max number of columns
  const numCols = Math.max(0, ...contentRows.map(row => row.length));

  // Header row: a single cell that will span all columns
  // We'll create an actual <th> with colspan after table creation
  const headerRow = ['Columns'];

  // Compose the final table data
  const tableRows = [headerRow, ...contentRows];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Fix: Set the header cell to span all content columns
  if (numCols > 1) {
    const th = table.querySelector('th');
    if (th) th.setAttribute('colspan', numCols);
  }

  // Replace the original element
  element.replaceWith(table);
}
