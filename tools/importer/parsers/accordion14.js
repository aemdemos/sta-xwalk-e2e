/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion block within the provided element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row as specified
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Select all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: get the text from the button's title span
    const titleBtn = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleContent = '';
    if (titleBtn) {
      titleContent = titleBtn.textContent.trim();
    }

    // Content cell: get the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Defensive: find the first cmp-container inside the panel
      const container = panel.querySelector('.cmp-container');
      if (container) {
        contentCell = container;
      } else {
        // fallback: use panel itself if no container
        contentCell = panel;
      }
    } else {
      contentCell = document.createElement('div');
    }

    rows.push([titleContent, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the table
  accordion.replaceWith(table);
}
