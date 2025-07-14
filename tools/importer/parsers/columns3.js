/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with header row: one cell with block name
  const headerRow = ['Columns'];
  const tableRows = [headerRow];

  // Find all rows in the columns block (each row is a direct child div)
  const rows = Array.from(element.querySelectorAll(':scope > div'));

  // For each row, build an array of cells (one per immediate child div)
  rows.forEach((rowDiv) => {
    const cols = Array.from(rowDiv.querySelectorAll(':scope > div'));
    const rowCells = cols.map((colDiv) => {
      // collect all child nodes of the column into a fragment
      const frag = document.createDocumentFragment();
      Array.from(colDiv.childNodes).forEach(node => frag.appendChild(node));
      return frag.childNodes.length === 1 ? frag.firstChild : frag;
    });
    tableRows.push(rowCells);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
