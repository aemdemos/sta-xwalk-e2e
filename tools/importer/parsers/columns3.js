/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct child divs (these are the visual rows in the columns block)
  const rowGroups = Array.from(element.querySelectorAll(':scope > div'));

  // Prepare the output table: header + rows
  const table = [];
  // Add the header row (only one cell, as required by the example)
  table.push(['Columns']);

  // For each visual row, create a row in the table with one cell per column
  rowGroups.forEach((row) => {
    // In each visual row, the actual columns are direct children divs
    const columns = Array.from(row.querySelectorAll(':scope > div'));
    table.push(columns);
  });

  // Build the table using the helper
  const block = WebImporter.DOMUtils.createTable(table, document);

  // Replace original element with new block table
  element.replaceWith(block);
}
