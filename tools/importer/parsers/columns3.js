/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block containing the columns
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Header row - must match example exactly
  const headerRow = ['Columns (columns3)'];

  // Each top-level child of the columns block represents a row in the columns layout
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));
  const tableRows = [];
  for (const rowDiv of rowDivs) {
    // Each row contains two columns: either order: [left, right] or [image, text]
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // Ensure exactly 2 columns per row as per structure
    if (colDivs.length === 2) {
      // For each column, gather all children (preserving nodes)
      const cells = colDivs.map(col => {
        // Remove empty text nodes
        const children = Array.from(col.childNodes).filter(
          (node) => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
        );
        // If only one child, return it directly
        if (children.length === 1) {
          return children[0];
        } else {
          return children;
        }
      });
      tableRows.push(cells);
    }
  }

  // Only proceed if we collected at least one row
  if (tableRows.length) {
    const cells = [headerRow, ...tableRows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    columnsBlock.replaceWith(table);
  }
}
