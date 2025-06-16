/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual columns block (could be `element` or a child)
  let columnsBlock = element;
  if (!columnsBlock.classList.contains('columns')) {
    const found = element.querySelector('.columns.block');
    if (found) columnsBlock = found;
  }

  // Get all direct children of the columns block (these are the grid rows)
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // Prepare table rows: the first row is the header (exactly one column)
  const tableRows = [];
  tableRows.push(['Columns']);

  // For each row, collect its columns (each div inside the rowDiv)
  rowDivs.forEach((rowDiv) => {
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    if (colDivs.length > 0) {
      tableRows.push(colDivs);
    }
  });

  // Only create the block if there is at least one row of columns (besides the header)
  if (tableRows.length > 1) {
    // Create table manually to force single-cell header row, then normal rows
    const table = document.createElement('table');
    // Header row with one cell, no colspan
    const headerTr = document.createElement('tr');
    const headerTh = document.createElement('th');
    headerTh.textContent = 'Columns';
    headerTr.appendChild(headerTh);
    table.appendChild(headerTr);
    // Now add all other rows
    for (let i = 1; i < tableRows.length; i++) {
      const dataRow = tableRows[i];
      const tr = document.createElement('tr');
      dataRow.forEach(cell => {
        const td = document.createElement('td');
        td.append(cell);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    }
    element.replaceWith(table);
  }
}
