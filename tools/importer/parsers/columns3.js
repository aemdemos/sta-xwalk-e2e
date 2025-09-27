/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children divs
  const getDirectDivs = (el) => Array.from(el.children).filter(child => child.tagName === 'DIV');

  // Header row as per spec
  const headerRow = ['Columns (columns3)'];

  // The main columns block is the first child div of the wrapper
  const columnsBlock = element.querySelector(':scope > div');
  if (!columnsBlock) return;

  // Each row in the columns block is a div (2 rows)
  const rowDivs = getDirectDivs(columnsBlock);

  // We'll build a 2D array for the table rows
  const tableRows = [headerRow];

  // For each row in the columns block
  rowDivs.forEach((rowDiv) => {
    // Each column in a row is a direct child div
    const colDivs = getDirectDivs(rowDiv);
    // Defensive: skip empty rows
    if (colDivs.length === 0) return;
    // For each column, collect its content
    const rowCells = colDivs.map((colDiv) => {
      // If the column is just an image column, use its content directly
      // Otherwise, collect all its children as a fragment
      // (This ensures we get both text and button, or just image)
      if (colDiv.classList.contains('columns-img-col')) {
        // Use the picture or image element directly
        const pic = colDiv.querySelector('picture, img');
        return pic ? pic : colDiv;
      } else {
        // Gather all children (paragraphs, lists, buttons, etc)
        const nodes = Array.from(colDiv.childNodes).filter(n => {
          // Remove empty text nodes
          return n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== '';
        });
        // If only one node, return it directly
        if (nodes.length === 1) return nodes[0];
        // Otherwise, return as array
        return nodes;
      }
    });
    tableRows.push(rowCells);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
