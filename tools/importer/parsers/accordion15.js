/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the provided element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Prepare the header row
  const headerRow = ['Accordion (accordion15)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: get the button text (the clickable label)
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = titleSpan ? titleSpan : document.createTextNode('');

    // Content cell: get the panel content
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = [];
    if (panel) {
      // Defensive: grab all direct children of the panel
      // Usually there's a container > cmp-container > text, etc.
      // We'll grab the whole panel content for resilience
      // But we want only the actual visible content, not the wrapper divs
      // So we look for .cmp-text or similar inside
      const textBlocks = panel.querySelectorAll('.cmp-text');
      if (textBlocks.length > 0) {
        textBlocks.forEach(tb => contentCell.push(tb));
      } else {
        // Fallback: use all children
        Array.from(panel.children).forEach(child => contentCell.push(child));
      }
    }
    if (contentCell.length === 1) contentCell = contentCell[0];
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
