/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the provided element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row as specified
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the title text from the button span
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = '';
    if (titleSpan) {
      titleCell = titleSpan.textContent.trim();
    }

    // Content cell: get the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Defensive: find the first container inside the panel
      const innerContainer = panel.querySelector('.cmp-container');
      if (innerContainer) {
        // Usually the text block is inside this container
        const textBlock = innerContainer.querySelector('.cmp-text');
        if (textBlock) {
          contentCell = textBlock;
        } else {
          // If not found, use the whole inner container
          contentCell = innerContainer;
        }
      } else {
        // If no inner container, use the panel itself
        contentCell = panel;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
