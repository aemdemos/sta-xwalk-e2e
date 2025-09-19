/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block (should have two direct children: each is a visual row)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  const rows = Array.from(columnsBlock.children);
  if (rows.length < 2) return;

  // Header row
  const headerRow = ['Columns (columns3)'];

  // First visual row (top two columns)
  const firstRowCols = Array.from(rows[0].children);
  if (firstRowCols.length < 2) return;
  const leftCell1 = Array.from(firstRowCols[0].childNodes);
  const rightCell1 = firstRowCols[1].querySelector('picture');

  // Second visual row (bottom two columns)
  const secondRowCols = Array.from(rows[1].children);
  if (secondRowCols.length < 2) return;
  const leftCell2 = secondRowCols[0].querySelector('picture');
  const rightCell2 = Array.from(secondRowCols[1].childNodes);

  // Compose table rows
  const tableRows = [
    headerRow,
    [leftCell1, rightCell1],
    [leftCell2, rightCell2],
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  columnsBlock.replaceWith(table);
}
