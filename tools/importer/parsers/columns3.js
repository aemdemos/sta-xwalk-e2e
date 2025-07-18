/* global WebImporter */
export default function parse(element, { document }) {
  // Get each visual row in the columns block
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  if (!rows.length) return;
  
  // Header row must match exactly
  const headerRow = ['Columns'];
  const bodyRows = [];
  let maxCols = 0;

  rows.forEach(row => {
    // Each visual row: get immediate column divs
    const columns = Array.from(row.querySelectorAll(':scope > div'));
    let cellEls;
    if (columns.length) {
      cellEls = columns.map(col => {
        // If the column is just a wrapper with a single child, unwrap certain wrappers for cleaner output
        if (
          col.childElementCount === 1 &&
          (col.classList.contains('columns-img-col') || col.firstElementChild.tagName === 'PICTURE')
        ) {
          return col.firstElementChild;
        }
        return col;
      });
    } else {
      // edge-case: row doesn't have column divs, treat the row itself as a single cell
      cellEls = [row];
    }
    if (cellEls.length > maxCols) maxCols = cellEls.length;
    bodyRows.push(cellEls);
  });

  // Pad rows to maxCols
  const paddedRows = bodyRows.map(row => row.length < maxCols ? [...row, ...Array(maxCols - row.length).fill('')] : row);

  // Compose the final cells array
  const cells = [headerRow, ...paddedRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
