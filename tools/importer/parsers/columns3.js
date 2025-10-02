/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get the top-level column groups (each is a div)
  const columnGroups = Array.from(columnsBlock.children);
  if (columnGroups.length < 2) return;

  // Prepare header row
  const headerRow = ['Columns (columns3)'];

  // --- First row: left (text+list+button), right (image) ---
  const firstGroup = columnGroups[0];
  const firstGroupChildren = Array.from(firstGroup.children);
  // Defensive: ensure we have both columns
  if (firstGroupChildren.length < 2) return;
  const firstRow = [
    firstGroupChildren[0], // left: text, list, button
    firstGroupChildren[1]  // right: image
  ];

  // --- Second row: left (image), right (text+button) ---
  const secondGroup = columnGroups[1];
  const secondGroupChildren = Array.from(secondGroup.children);
  if (secondGroupChildren.length < 2) return;
  const secondRow = [
    secondGroupChildren[0], // left: image
    secondGroupChildren[1]  // right: text, button
  ];

  // Build table
  const rows = [
    headerRow,
    firstRow,
    secondRow
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
