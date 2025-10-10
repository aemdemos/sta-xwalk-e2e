/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block (the <ul> inside the .cards block)
  const cardsBlock = element.querySelector('.cards.block ul');
  if (!cardsBlock) return;

  // Prepare table rows
  const rows = [];
  // Header row as per instructions
  rows.push(['Cards (cards4)']);

  // For each card (li)
  cardsBlock.querySelectorAll(':scope > li').forEach((li) => {
    // Image cell
    const imageDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imageDiv) {
      // Find the <picture> or <img>
      const pic = imageDiv.querySelector('picture') || imageDiv.querySelector('img');
      if (pic) {
        // Wrap with field comment
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(' field:image '));
        frag.appendChild(pic);
        imageCell = frag;
      }
    }

    // Text cell
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use the bodyDiv as is (contains <p> with <strong> and description)
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:text '));
      // Move all children of bodyDiv into frag
      Array.from(bodyDiv.childNodes).forEach((node) => {
        frag.appendChild(node);
      });
      textCell = frag;
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
