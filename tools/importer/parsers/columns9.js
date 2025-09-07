/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid container that holds the columns
  let grid;
  const gridCandidates = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  if (gridCandidates.length) {
    grid = gridCandidates[gridCandidates.length - 1];
  } else {
    grid = element;
  }

  // Find the logo image block (first column)
  const logoCol = grid.querySelector('.image.cmp-image--logo');
  let logoBlock = null;
  if (logoCol) {
    logoBlock = logoCol;
  }

  // Find the navigation block (second column)
  const navCol = grid.querySelector('.navigation.cmp-navigation--footer');
  let navBlock = null;
  if (navCol) {
    navBlock = navCol;
  }

  // Find the title block ("Follow Us") (third column)
  const titleCol = grid.querySelector('.title.cmp-title--right');
  let titleBlock = null;
  if (titleCol) {
    titleBlock = titleCol;
  }

  // Find the social buttons block (fourth column)
  const btnListCol = grid.querySelector('.buildingblock.cmp-buildingblock--btn-list');
  let btnListBlock = null;
  if (btnListCol) {
    btnListBlock = btnListCol;
  }

  // Find the copyright text block (bottom row)
  const textCol = grid.querySelector('.text.cmp-text--font-xsmall');
  let textBlock = null;
  if (textCol) {
    // Use all childNodes (not just <p>) and preserve all markup including links
    const infoDiv = document.createElement('div');
    Array.from(textCol.childNodes).forEach((node) => {
      infoDiv.appendChild(node.cloneNode(true));
    });
    textBlock = infoDiv;
  }

  // Compose the columns row
  const columnsRow = [];
  if (logoBlock) columnsRow.push(logoBlock);
  if (navBlock) columnsRow.push(navBlock);
  if (titleBlock) columnsRow.push(titleBlock);
  if (btnListBlock) columnsRow.push(btnListBlock);

  // Compose the copyright/info row (spans all columns)
  const infoRow = [textBlock];

  // Table header
  const headerRow = ['Columns (columns9)'];

  // Compose final table
  const cells = [
    headerRow,
    columnsRow,
    infoRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
