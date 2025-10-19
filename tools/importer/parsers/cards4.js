/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a mandatory field comment
  function commentedFragment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Cards block header row
  const headerRow = ['Cards (cards4)'];

  // Find the cards block container
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all card items (li elements)
  const cardItems = Array.from(cardsBlock.querySelectorAll('ul > li'));

  // Build rows for each card
  const rows = cardItems.map((li) => {
    // Image cell: find the .cards-card-image and use its <picture> (with img)
    const imageDiv = li.querySelector('.cards-card-image picture');
    let imageCell = '';
    if (imageDiv) {
      imageCell = commentedFragment('image', imageDiv);
    }

    // Text cell: find the .cards-card-body
    const textDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (textDiv) {
      textCell = commentedFragment('text', textDiv);
    }

    return [imageCell, textCell];
  });

  // Compose the table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
