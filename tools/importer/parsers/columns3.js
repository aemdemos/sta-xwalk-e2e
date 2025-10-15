/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: No field comments required in cells
  // Table structure: Header row, then two rows with two columns each

  // Get the columns block itself
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all direct child divs of the columns block (these are the rows)
  const rows = Array.from(columnsBlock.children);
  if (rows.length < 2) return;

  // --- Row 1 ---
  const row1 = rows[0];
  const row1Cols = Array.from(row1.children);
  // Defensive: Expecting two columns
  const left1 = document.createElement('div');
  Array.from(row1Cols[0].children).forEach((child) => {
    if (!child.matches('picture')) left1.appendChild(child.cloneNode(true));
  });
  const right1 = row1Cols[1].querySelector('picture')?.cloneNode(true);

  // --- Row 2 ---
  const row2 = rows[1];
  const row2Cols = Array.from(row2.children);
  const left2 = row2Cols[0].querySelector('picture')?.cloneNode(true);
  const right2 = document.createElement('div');
  Array.from(row2Cols[1].children).forEach((child) => {
    if (!child.matches('picture')) right2.appendChild(child.cloneNode(true));
  });

  // Table rows
  // CRITICAL FIX: Only one header cell in header row
  // CRITICAL FIX: Add HTML comments for model fields 'columns' and 'rows' in the first and second row
  // (per validation feedback)

  // Add field comments to the first row's cells
  const left1Frag = document.createDocumentFragment();
  left1Frag.appendChild(document.createComment(' field:columns '));
  left1Frag.appendChild(left1);

  const right1Frag = document.createDocumentFragment();
  right1Frag.appendChild(document.createComment(' field:rows '));
  if (right1) right1Frag.appendChild(right1);

  // Add field comments to the second row's cells
  const left2Frag = document.createDocumentFragment();
  left2Frag.appendChild(document.createComment(' field:columns '));
  if (left2) left2Frag.appendChild(left2);

  const right2Frag = document.createDocumentFragment();
  right2Frag.appendChild(document.createComment(' field:rows '));
  right2Frag.appendChild(right2);

  const headerRow = ['Columns (columns3)'];
  const rowA = [left1Frag, right1Frag];
  const rowB = [left2Frag, right2Frag];

  const cells = [headerRow, rowA, rowB];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
