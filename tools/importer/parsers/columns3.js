/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main block
  const block = element.querySelector('.columns.block');
  if (!block) return;

  // Header must match example exactly
  const header = ['Columns (columns3)'];

  // The block has two direct child divs (rows)
  const rowDivs = Array.from(block.children);
  if (rowDivs.length < 2) return;

  // First row: text, list, button | green helix image
  const firstRowLeft = rowDivs[0].children[0]; // Text/ul/button
  const firstRowRight = rowDivs[0].children[1]; // Picture

  // Second row: yellow helix image | preview text/button
  const secondRowLeft = rowDivs[1].children[0]; // Picture
  const secondRowRight = rowDivs[1].children[1]; // Text/button

  // Build output structure
  const cells = [
    header,
    [firstRowLeft, firstRowRight],
    [secondRowLeft, secondRowRight]
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
