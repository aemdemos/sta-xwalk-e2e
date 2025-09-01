/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing the card <li> elements
  let ul = element.querySelector('ul');
  if (!ul) {
    // fallback for nested structure
    ul = element.querySelector('.cards.block > ul');
  }
  if (!ul) {
    const innerCards = element.querySelector('.cards.block');
    if (innerCards) ul = innerCards.querySelector('ul');
  }
  if (!ul) return;

  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  // Table header
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card, extract [image, text]
  lis.forEach(li => {
    // Get the image element (picture)
    let imageEl = null;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) imageEl = picture;
    }

    // Get the card body (text)
    let bodyContent = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // If there's only one child, use it; otherwise, combine all children
      if (bodyDiv.children.length === 1) {
        bodyContent = bodyDiv.firstElementChild;
      } else {
        // Create a fragment with all children, referencing originals
        const fragment = document.createDocumentFragment();
        Array.from(bodyDiv.children).forEach(child => fragment.appendChild(child));
        bodyContent = fragment;
      }
    }

    // Add the row
    rows.push([
      imageEl || '',
      bodyContent || ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with the new block table
  element.replaceWith(table);
}
