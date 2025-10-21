/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block root (the <div class="cards block">)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards.block');
  }
  if (!cardsBlock) return;

  // Find the <ul> containing the cards
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  // Prepare the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards4)']);

  // Loop over each <li> (card)
  ul.querySelectorAll('li').forEach((li) => {
    // Image cell
    const imageDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imageDiv) {
      // Find the <picture> or <img> inside
      let picEl = imageDiv.querySelector('picture');
      let imgEl = imageDiv.querySelector('img');
      let imgContent = picEl || imgEl;
      if (imgContent) {
        // Reference the existing element, do not clone
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(' field:image '));
        frag.appendChild(imgContent);
        imageCell = frag;
      }
    }

    // Text cell
    const textDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (textDiv) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:text '));
      // Move all children of textDiv into the fragment
      Array.from(textDiv.childNodes).forEach((node) => {
        frag.appendChild(node);
      });
      textCell = frag;
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
