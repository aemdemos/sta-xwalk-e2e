/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards4) block: 2 columns, multiple rows, header row with block name
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Defensive: find the UL containing card items
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  lis.forEach((li) => {
    // Find image (picture element)
    const imageDiv = li.querySelector('.cards-card-image');
    let imageCell = document.createDocumentFragment();
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell.appendChild(document.createComment(' field:image '));
        imageCell.appendChild(picture);
      }
    }

    // Find text (body)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = document.createDocumentFragment();
    if (bodyDiv) {
      textCell.appendChild(document.createComment(' field:text '));
      // Append all children of bodyDiv (preserving structure)
      Array.from(bodyDiv.childNodes).forEach((node) => {
        textCell.appendChild(node);
      });
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
