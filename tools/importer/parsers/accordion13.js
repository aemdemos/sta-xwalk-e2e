/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion block within the provided element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row as specified
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the button title text
    let titleText = '';
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleText = titleSpan.textContent.trim();
    } else {
      // Fallback: try to get button text
      const button = item.querySelector('button');
      if (button) titleText = button.textContent.trim();
    }
    // Defensive: always ensure a string
    if (!titleText) titleText = '';

    // Content cell: find the panel and reference its content
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Reference the entire panel content (usually a container)
      // Defensive: if panel has only one child, reference that
      if (panel.children.length === 1) {
        contentCell = panel.children[0];
      } else {
        contentCell = panel;
      }
    }
    rows.push([titleText, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
