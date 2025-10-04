/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> of cards inside the block
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row as required
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each <li> is a card
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Get image (first cell)
    const imageWrapper = li.querySelector(':scope > .cards-card-image');
    let imageCell = '';
    if (imageWrapper) {
      // Use the <picture> or <img> directly
      const picture = imageWrapper.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageWrapper.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Get text (second cell)
    const bodyWrapper = li.querySelector(':scope > .cards-card-body');
    let textCell = '';
    if (bodyWrapper) {
      // Defensive: collect all children (title, description, etc.)
      // This will grab <p><strong>Title</strong></p> and <p>Description</p>
      const children = Array.from(bodyWrapper.children);
      textCell = children;
    }

    rows.push([imageCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
