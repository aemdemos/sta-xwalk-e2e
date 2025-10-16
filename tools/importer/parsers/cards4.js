/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block (the <ul> with <li> for each card)
  const cardsBlock = element.querySelector('ul');
  if (!cardsBlock) return;
  const cards = Array.from(cardsBlock.querySelectorAll(':scope > li'));

  // Prepare the header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  cards.forEach((card) => {
    // Image cell
    const imageDiv = card.querySelector('.cards-card-image');
    let imageCell = '';
    if (imageDiv) {
      // Find the <picture> or <img>
      let picture = imageDiv.querySelector('picture');
      let img = imageDiv.querySelector('img');
      let content = null;
      if (picture) {
        content = picture;
      } else if (img) {
        content = img;
      }
      if (content) {
        // Wrap with field comment
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(' field:image '));
        frag.appendChild(content);
        imageCell = frag;
      }
    }

    // Text cell
    const bodyDiv = card.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use all children of bodyDiv (usually <p><strong>...</strong></p> and <p>desc</p>)
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:text '));
      Array.from(bodyDiv.childNodes).forEach((node) => {
        frag.appendChild(node.cloneNode(true));
      });
      textCell = frag;
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
