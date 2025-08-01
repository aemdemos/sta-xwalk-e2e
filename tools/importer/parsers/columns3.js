/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child divs (rows)
  const rows = Array.from(element.querySelectorAll(':scope > div'));

  // Header row: always a single cell
  const cells = [['Columns']];

  // If there are any rows, treat the first row as the columns row
  if (rows.length) {
    // Get each column (direct child div of the row)
    const columns = Array.from(rows[0].querySelectorAll(':scope > div'));
    // For each column, collect its full content (as a fragment)
    const contentCells = columns.map((col) => {
      if (!col || !col.childNodes.length) return '';
      if (col.childNodes.length === 1 && col.firstElementChild) return col.firstElementChild;
      const frag = document.createDocumentFragment();
      Array.from(col.childNodes).forEach(node => frag.appendChild(node));
      return frag;
    });
    // Add one row to cells, with as many columns as found
    cells.push(contentCells);
  }

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
