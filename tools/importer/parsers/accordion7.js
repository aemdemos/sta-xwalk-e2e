/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the element
  const accordion = Array.from(element.querySelectorAll('.accordion, .cmp-accordion')).find(el => el.classList.contains('cmp-accordion'));
  if (!accordion) return;

  // Table header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get the text from the button title span
    let titleText = '';
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleText = titleSpan.textContent.trim();
    } else {
      // Fallback: get button text
      const button = item.querySelector('button');
      titleText = button ? button.textContent.trim() : '';
    }
    // Content cell: get the panel content
    let contentCell;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Defensive: find the main content container inside the panel
      // Usually a responsivegrid/container structure
      const contentContainer = panel.querySelector('.cmp-container') || panel;
      // If there are multiple children, combine them in an array
      const contentElements = Array.from(contentContainer.children).filter(child => child.nodeType === 1);
      if (contentElements.length === 1) {
        contentCell = contentElements[0];
      } else if (contentElements.length > 1) {
        contentCell = contentElements;
      } else {
        // Fallback: use panel itself
        contentCell = panel;
      }
    } else {
      // Fallback: empty cell
      contentCell = '';
    }
    rows.push([titleText, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
