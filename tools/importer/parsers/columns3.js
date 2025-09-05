/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Always use the required header row
  const headerRow = ['Columns (columns3)'];

  // The structure is: <div class="columns block ..."> <div>ROW1</div> <div>ROW2</div> </div>
  // Each row-div contains two columns as direct children
  const rows = Array.from(element.children);
  const tableRows = [];

  rows.forEach((rowDiv) => {
    // Only consider rowDivs that have at least 2 children (columns)
    const cols = Array.from(rowDiv.children);
    if (cols.length < 2) return;
    // For each column, clone the node to avoid moving it in the DOM
    tableRows.push([cols[0].cloneNode(true), cols[1].cloneNode(true)]);
  });

  // Only proceed if we have at least one row
  if (tableRows.length === 0) return;

  const tableArray = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}
