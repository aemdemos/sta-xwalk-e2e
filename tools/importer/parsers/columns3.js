/* global WebImporter */
export default function parse(element, { document }) {
  // Get top-level column groups
  const columnGroups = Array.from(element.querySelectorAll(':scope > div > div'));
  if (columnGroups.length < 2) return;

  // Header row: must match target block name exactly
  const headerRow = ['Columns (columns3)'];

  // First row: left (text), right (image)
  const firstLeft = columnGroups[0].children[0]; // text, list, button
  const firstRight = columnGroups[0].children[1]; // image

  // Second row: left (image), right (text)
  const secondLeft = columnGroups[1].children[0]; // image
  const secondRight = columnGroups[1].children[1]; // text, button

  // Compose table rows referencing existing elements
  const rows = [headerRow, [firstLeft, firstRight], [secondLeft, secondRight]];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the columns block with the generated table
  element.replaceWith(table);
}
