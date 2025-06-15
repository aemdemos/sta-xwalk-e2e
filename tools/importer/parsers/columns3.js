/* global WebImporter */
export default function parse(element, { document }) {
  // Find the direct columns block inside this wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each immediate child of columnsBlock is a row/group (corresponds to a visual row in the screenshot)
  const groupRows = Array.from(columnsBlock.children);
  if (groupRows.length === 0) return;

  // Build the rows for the table
  // Header row as in the markdown example: only a single cell
  const cells = [['Columns (columns3)']];

  // For each group row, extract its two columns (each is a <div>). Each group row is one table row, two cells.
  groupRows.forEach((groupRow) => {
    const columns = Array.from(groupRow.children);
    const rowCells = [columns[0] || '', columns[1] || ''];
    cells.push(rowCells);
  });

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
