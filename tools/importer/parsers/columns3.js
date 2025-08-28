/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main rows (each is a direct child div of the wrapper)
  const mainRows = Array.from(element.querySelectorAll(':scope > div'));
  if (mainRows.length !== 2) return;

  // For each row, find the two columns (each is a div)
  const columnsRow1 = Array.from(mainRows[0].querySelectorAll(':scope > div'));
  const columnsRow2 = Array.from(mainRows[1].querySelectorAll(':scope > div'));

  // The columns block should have exactly 2 rows, each with 2 columns according to the HTML structure
  // For each column, gather all direct children (preserves list, buttons, images, etc.)
  function cellContent(colDiv) {
    // Filter out empty text nodes
    return Array.from(colDiv.childNodes).filter(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        return n.textContent.trim().length > 0;
      }
      return true;
    });
  }

  const row1cells = columnsRow1.map(cellContent);
  const row2cells = columnsRow2.map(cellContent);

  // Table header as specified
  const headerRow = ['Columns (columns3)'];

  // Assemble the table data
  const tableData = [
    headerRow,
    row1cells,
    row2cells
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
