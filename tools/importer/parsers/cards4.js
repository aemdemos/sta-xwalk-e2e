/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards block (the direct container of the cards)
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Find all card items (li elements)
  const cardItems = cardsBlock.querySelectorAll('ul > li');

  // Header row as per requirements
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cardItems.forEach((li) => {
    // Image cell
    const imageDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imageDiv) {
      // Find the <img> inside the <picture>
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        // Use the existing <picture> element for robustness
        // Wrap with field comment for 'image'
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(' field:image '));
        frag.appendChild(picture);
        imageCell = frag;
      }
    }

    // Text cell
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use the bodyDiv directly for robustness
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:text '));
      frag.appendChild(bodyDiv);
      textCell = frag;
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
