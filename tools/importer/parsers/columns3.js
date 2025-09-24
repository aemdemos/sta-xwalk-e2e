/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual columns block (not the wrapper)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get the two rows (each is a direct child div of columnsBlock)
  const rows = Array.from(columnsBlock.children);
  if (rows.length < 2) return;

  // First row: left (text), right (image)
  const firstRowDivs = Array.from(rows[0].children);
  if (firstRowDivs.length < 2) return;
  const firstRowLeft = firstRowDivs[0];
  const firstRowRight = firstRowDivs[1];

  // Second row: left (image), right (text)
  const secondRowDivs = Array.from(rows[1].children);
  if (secondRowDivs.length < 2) return;
  const secondRowLeft = secondRowDivs[0];
  const secondRowRight = secondRowDivs[1];

  // Table header
  const headerRow = ['Columns (columns3)'];

  // First row content
  const firstRowLeftContent = Array.from(firstRowLeft.childNodes);
  const firstRowRightPicture = firstRowRight.querySelector('picture');

  // Second row content
  const secondRowLeftPicture = secondRowLeft.querySelector('picture');
  const secondRowRightContent = Array.from(secondRowRight.childNodes);

  // Compose table rows
  const row1 = [firstRowLeftContent, firstRowRightPicture];
  const row2 = [secondRowLeftPicture, secondRowRightContent];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row1,
    row2,
  ], document);

  // Replace the columns block (not the wrapper)
  columnsBlock.replaceWith(table);
}
