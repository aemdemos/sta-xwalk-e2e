/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block (might be the element itself, or a descendant)
  let columnsBlock = element;
  if (!columnsBlock.classList.contains('columns')) {
    columnsBlock = element.querySelector('.columns');
  }

  // Prepare the header row exactly as required
  const cells = [
    ['Columns (columns3)']
  ];

  // Get all direct rows (columns per row) inside the columns block
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));
  for (const rowDiv of rowDivs) {
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // Each cell should contain an array with the referenced source element(s)
    if (colDivs.length > 0) {
      cells.push(colDivs.map(col => [col]));
    }
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
