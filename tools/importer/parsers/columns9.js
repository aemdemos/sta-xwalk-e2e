/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the footer columns
  let grid;
  const gridCandidates = element.querySelectorAll('.aem-Grid');
  for (const candidate of gridCandidates) {
    if (candidate.children.length >= 4) {
      grid = candidate;
      break;
    }
  }
  if (!grid) return;

  // Find the column elements
  let logoCol = grid.querySelector('.cmp-image--logo');
  if (!logoCol) logoCol = grid.querySelector('.cmp-image');

  let navCol = grid.querySelector('.cmp-navigation--footer');
  if (!navCol) navCol = grid.querySelector('.cmp-navigation');

  let titleCol = grid.querySelector('.cmp-title--right');
  if (!titleCol) titleCol = grid.querySelector('.cmp-title');

  let btnListCol = grid.querySelector('.cmp-buildingblock--btn-list');
  if (!btnListCol) btnListCol = grid.querySelector('.xf-master-building-block');

  let textCol = grid.querySelector('.cmp-text--font-xsmall');
  if (!textCol) textCol = grid.querySelector('.cmp-text');

  // --- CRITICAL FIX: Use outerHTML to preserve all markup (including links) ---
  // This ensures all anchor tags and formatting are preserved
  let textColFragment = document.createElement('div');
  if (textCol) {
    textColFragment.innerHTML = textCol.outerHTML;
    // Unwrap the inner .cmp-text so only its children are present
    const inner = textColFragment.querySelector('.cmp-text');
    if (inner) {
      while (inner.firstChild) {
        textColFragment.appendChild(inner.firstChild);
      }
      inner.remove();
    }
  }

  // Compose left column: logo + nav + text
  const leftCol = document.createElement('div');
  if (logoCol) leftCol.appendChild(logoCol.cloneNode(true));
  if (navCol) leftCol.appendChild(navCol.cloneNode(true));
  if (textColFragment.childNodes.length) {
    Array.from(textColFragment.childNodes).forEach(node => leftCol.appendChild(node));
  }

  // Compose right column: title + buttons
  const rightCol = document.createElement('div');
  if (titleCol) rightCol.appendChild(titleCol.cloneNode(true));
  if (btnListCol) rightCol.appendChild(btnListCol.cloneNode(true));

  // Table header
  const headerRow = ['Columns (columns9)'];
  // Table content row
  const contentRow = [leftCol, rightCol];

  // Create table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
