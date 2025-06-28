/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly as specified
  const table = [['Columns']];

  // For each visual row (direct child <div> of element)
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));
  rowDivs.forEach(rowDiv => {
    // For each column in this row (direct child <div>s of the row)
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // Each cell: if empty, empty string, else all children
    const cells = colDivs.map(colDiv => {
      if (!colDiv.childNodes.length) return '';
      // If only one child, use the node; otherwise, array for multiple elements
      if (colDiv.childNodes.length === 1) return colDiv.childNodes[0];
      return Array.from(colDiv.childNodes);
    });
    // Only add row if there's at least one non-empty cell
    if (cells.length && cells.some(cell => cell !== '' && cell !== undefined && cell !== null)) {
      table.push(cells);
    }
  });

  // Replace the block
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
