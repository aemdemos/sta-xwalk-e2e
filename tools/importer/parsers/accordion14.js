/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the provided element
  const accordion = Array.from(element.querySelectorAll(':scope .accordion, :scope .cmp-accordion')).find(el => el.classList.contains('cmp-accordion'));
  if (!accordion) return;

  // Table header row as required
  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get the visible button text
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleContent = titleSpan ? titleSpan.textContent.trim() : '';
    // Defensive: fallback to button text if title span missing
    if (!titleContent) {
      const btn = item.querySelector('.cmp-accordion__button');
      if (btn) titleContent = btn.textContent.trim();
    }
    // Create a strong element for the title (to match visual style)
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleContent;

    // Content cell: get the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Defensive: find the first container inside the panel
      const container = panel.querySelector('.cmp-container') || panel;
      // Gather all direct children (usually just one .text block)
      const children = Array.from(container.children);
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // fallback: use panel itself
        contentCell = panel;
      }
    } else {
      // fallback: empty cell
      contentCell = '';
    }

    rows.push([titleEl, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the table
  accordion.replaceWith(table);
}
