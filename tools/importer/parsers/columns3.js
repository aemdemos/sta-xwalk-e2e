/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !document) return;

  // Helper to get image from picture
  function getImgFromPicture(picture) {
    if (!picture) return null;
    return picture.querySelector('img');
  }

  // Get all immediate column groups (each <div> child of .columns.block)
  const columnGroups = Array.from(element.querySelectorAll(':scope > div'));

  // Build rows for the block table
  const headerRow = ['Columns (columns3)'];
  const rows = [];

  // Each group is a row, each child is a column
  columnGroups.forEach((group) => {
    const groupChildren = Array.from(group.children);
    const row = [];
    groupChildren.forEach((child) => {
      if (child.classList.contains('columns-img-col')) {
        const picture = child.querySelector('picture');
        const img = getImgFromPicture(picture);
        row.push(img ? img : child);
      } else {
        // Gather all non-image children into one cell
        row.push(child);
      }
    });
    // Only push row if it has at least one non-empty cell
    if (row.length > 0) rows.push(row);
  });

  // Compose table data
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
