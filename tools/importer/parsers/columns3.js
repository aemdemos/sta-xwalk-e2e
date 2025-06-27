/* global WebImporter */
export default function parse(element, { document }) {
  // Find actual columns block container (skip wrapper)
  let columnsBlock = element;
  if (columnsBlock.classList.contains('columns-wrapper')) {
    const inner = columnsBlock.querySelector(':scope > .columns.block');
    if (inner) columnsBlock = inner;
  }

  // Get the row divs (each direct child of the columns block)
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // Build table rows, starting with a SINGLE-COLUMN header row
  const tableRows = [['Columns']];

  // For each row, add an array of its immediate child divs as cells (columns)
  rowDivs.forEach(rowDiv => {
    const columnDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // If there are no immediate div children, treat the rowDiv itself as a single column
    if (columnDivs.length > 0) {
      tableRows.push(columnDivs);
    } else {
      tableRows.push([rowDiv]);
    }
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element in the DOM
  element.replaceWith(table);
}
