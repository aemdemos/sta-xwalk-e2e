/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual cards block (may be wrapped)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards');
  }
  if (!cardsBlock) return;

  // Find all card items (li elements)
  const list = cardsBlock.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children);

  // Prepare table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  items.forEach((li) => {
    // Image cell
    const imageDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imageDiv) {
      // Find picture or img
      let imgContent = null;
      const pic = imageDiv.querySelector('picture');
      if (pic) {
        imgContent = pic;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imgContent = img;
      }
      if (imgContent) {
        // Wrap with field comment
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(' field:image '));
        frag.appendChild(imgContent);
        imageCell = frag;
      }
    }

    // Text cell
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use the entire bodyDiv content
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:text '));
      // Move all children into the fragment
      Array.from(bodyDiv.childNodes).forEach((n) => frag.appendChild(n));
      textCell = frag;
    }

    rows.push([imageCell, textCell]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
