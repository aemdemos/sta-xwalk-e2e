/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Table header row as per guidelines
  const headerRow = ['Columns (columns3)'];

  // Find all direct child divs (each is a row in the columns block)
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  const tableRows = [];

  rows.forEach((rowDiv) => {
    // Each row contains two columns (divs)
    const cols = Array.from(rowDiv.querySelectorAll(':scope > div'));
    // Defensive: ensure we have exactly two columns
    if (cols.length === 2) {
      // Reference the actual column divs so all content is preserved
      tableRows.push([cols[0], cols[1]]);
    }
  });

  // Compose the final cells array
  const cells = [headerRow, ...tableRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
