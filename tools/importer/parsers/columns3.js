/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be exactly one column with the block name
  const cells = [['Columns']];
  // Gather the rows (each child of .columns.block)
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  // For each row, create an array of columns (one cell per column)
  rows.forEach((row) => {
    const columns = Array.from(row.children);
    // For each column, gather ALL child nodes as content
    const rowCells = columns.map((col) => {
      // If there's only one direct child, use it; otherwise, group all child nodes
      if (col.childNodes.length === 1 && col.firstChild.nodeType === 1) {
        return col.firstChild;
      } else {
        // Create a fragment containing all child nodes
        const frag = document.createDocumentFragment();
        Array.from(col.childNodes).forEach((node) => {
          frag.appendChild(node);
        });
        return frag;
      }
    });
    // Each rowCells array becomes a row in the table
    cells.push(rowCells);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}