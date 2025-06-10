/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block element
  let columnsBlock = element;
  // If the wrapper was passed, get the first columns block inside
  if (columnsBlock.classList.contains('columns-wrapper')) {
    const maybeBlock = columnsBlock.querySelector('.columns.block');
    if (maybeBlock) columnsBlock = maybeBlock;
  }

  // The top-level structure: immediate children of the block are the rows (each with two columns)
  const rows = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // Table header matches the exact block name as in the example
  const tableRows = [['Columns (columns3)']];

  rows.forEach((rowDiv) => {
    // Each row consists of two columns (divs)
    const cols = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // Defensive: Only push non-empty arrays
    if (cols.length > 0) {
      tableRows.push(cols);
    } else {
      // If for some reason the rowDiv doesn't have columns, treat the whole rowDiv as a single cell
      tableRows.push([rowDiv]);
    }
  });

  // Create the block table with existing elements (no clones)
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
