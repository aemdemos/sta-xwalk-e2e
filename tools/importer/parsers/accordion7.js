/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordion = Array.from(element.querySelectorAll('.cmp-accordion')).find(Boolean);
  if (!accordion) return;

  // Table header row as required
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: find the button with the title span
    let titleText = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    }
    if (!titleText) {
      const h3 = item.querySelector('h3');
      if (h3) titleText = h3.textContent.trim();
    }

    // Title cell: plain text only
    const titleCell = titleText;

    // Content cell: extract only the inner HTML of the panel's .cmp-text
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        contentCell = textBlock.innerHTML;
      } else {
        // fallback: use all panel innerHTML
        contentCell = panel.innerHTML;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the new table
  accordion.replaceWith(table);
}
