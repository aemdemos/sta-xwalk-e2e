/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .columns.block element or fallback to the given element
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) columnsBlock = element;

  // Get the direct child rows (should be divs)
  const rows = Array.from(columnsBlock.children).filter((node) => node.tagName === 'DIV');

  // To match the example, group every two adjacent divs in each row as a single table row (for two columns)
  // So each row in the final table contains two cells: [ firstChild, secondChild ]
  const cells = [];
  // Always add the header row as a single column
  cells.push(['Columns']);

  // Go through each direct child of .columns.block two at a time
  for (let i = 0; i < rows.length; i += 2) {
    const first = rows[i];
    const second = rows[i + 1] || '';
    cells.push([first, second]);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
