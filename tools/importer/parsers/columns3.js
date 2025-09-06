/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we only parse the intended columns block
  if (!element || !element.classList.contains('columns-wrapper')) return;

  // Get the inner columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get the top-level column groups (each <div> direct child of .columns.block)
  const columnGroups = Array.from(columnsBlock.querySelectorAll(':scope > div'));

  // Prepare rows for the table
  const headerRow = ['Columns (columns3)'];
  const rows = [headerRow];

  // First row: 2 columns (content, image)
  if (columnGroups.length > 0) {
    const firstGroupChildren = Array.from(columnGroups[0].querySelectorAll(':scope > div'));
    // Defensive: ensure we have both content and image columns
    const firstColContent = firstGroupChildren[0] || document.createElement('div');
    const firstColImage = firstGroupChildren[1] || document.createElement('div');
    rows.push([firstColContent, firstColImage]);
  }

  // Second row: 2 columns (image, content)
  if (columnGroups.length > 1) {
    const secondGroupChildren = Array.from(columnGroups[1].querySelectorAll(':scope > div'));
    // Defensive: ensure we have both image and content columns
    const secondColImage = secondGroupChildren[0] || document.createElement('div');
    const secondColContent = secondGroupChildren[1] || document.createElement('div');
    rows.push([secondColImage, secondColContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
