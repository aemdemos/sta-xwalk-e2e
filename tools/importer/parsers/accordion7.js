/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Always use the required header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Extract all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get the text from the button's title span
    let title = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }
    if (!title) title = 'Accordion Item';

    // Content cell: get the panel content
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Find the first container inside the panel (if present)
      const container = panel.querySelector('.cmp-container');
      if (container) {
        // If the container has only one child, use that child
        if (container.children.length === 1) {
          contentCell = container.children[0];
        } else {
          // Otherwise, use all children as a fragment
          const frag = document.createDocumentFragment();
          Array.from(container.children).forEach(child => frag.appendChild(child.cloneNode(true)));
          contentCell = frag;
        }
      } else {
        // Fallback: use the panel itself
        contentCell = panel.cloneNode(true);
      }
    }
    rows.push([title, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(block);
}
