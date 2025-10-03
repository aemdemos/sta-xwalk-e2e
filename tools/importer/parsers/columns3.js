/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children divs
  const getDirectDivs = (el) => el ? Array.from(el.children).filter(c => c.tagName === 'DIV') : [];

  // Get the main columns block (the element passed in)
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) columnsBlock = element;
  const mainDivs = getDirectDivs(columnsBlock);

  // Defensive: If the structure is not as expected, bail
  if (mainDivs.length < 2) return;

  // First row: block name
  const headerRow = ['Columns (columns3)'];

  // Get first row columns
  const firstRowDivs = getDirectDivs(mainDivs[0]);
  if (firstRowDivs.length < 2) return;
  // Left cell: text, list, button
  const leftCell1 = firstRowDivs[0];
  // Right cell: image
  const rightCell1 = firstRowDivs[1];

  // Get second row columns
  const secondRowDivs = getDirectDivs(mainDivs[1]);
  if (secondRowDivs.length < 2) return;
  // Left cell: image
  const leftCell2 = secondRowDivs[0];
  // Right cell: text, button
  const rightCell2 = secondRowDivs[1];

  // Build the table rows
  const tableRows = [
    headerRow,
    [leftCell1, rightCell1],
    [leftCell2, rightCell2],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
