/* global WebImporter */
export default function parse(element, { document }) {
  // Start with the header row
  const cells = [['Columns']];

  // Each immediate child of 'element' is a row div (each with two columns)
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));

  rowDivs.forEach(rowDiv => {
    // Each row has two columns (left and right)
    const colDivs = Array.from(rowDiv.children);
    const row = colDivs.map(colDiv => {
      // Flatten if the column is a wrapper div with all content inside
      if (
        colDiv.children.length === 1 &&
        colDiv.firstElementChild &&
        colDiv.firstElementChild.tagName === 'DIV'
      ) {
        return Array.from(colDiv.firstElementChild.childNodes).filter(
          n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim()
        );
      }
      // Otherwise, provide all non-empty nodes
      return Array.from(colDiv.childNodes).filter(
        n => n.nodeType !== Node.TEXT_NODE || n.textContent.trim()
      );
    });
    // Only add the row if it contains exactly two columns, as expected for a 2-col layout
    if (row.length === 2) {
      cells.push(row);
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
