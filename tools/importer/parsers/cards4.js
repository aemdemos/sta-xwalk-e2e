/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  const rows = [];
  // Header row must exactly match the example ("Cards")
  rows.push(['Cards']);

  // For each card (li)
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Image/Icon cell (always first cell)
    let imgCell = null;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imgCell = img;
      }
    }

    // Text content cell (always second cell)
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // Reference the actual node for semantic accuracy
      textCell = bodyDiv;
    }

    // Add row only if both image and text are present (as per block usage)
    if (imgCell && textCell) {
      rows.push([imgCell, textCell]);
    }
  });

  // Build the block table from referenced elements
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(table);
}
