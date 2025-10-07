/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to wrap content with field comment
  function fieldCommentedFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the cards block container
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all card <li> elements
  const cardItems = Array.from(cardsBlock.querySelectorAll('ul > li'));

  // Table header row
  const headerRow = ['Cards (cards4)'];

  // Build card rows
  const rows = cardItems.map((li) => {
    // Image cell
    const imageDiv = li.querySelector('.cards-card-image');
    let imageEl = null;
    if (imageDiv) {
      // Use the <picture> element directly
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageEl = fieldCommentedFragment('image', picture);
      }
    }

    // Text cell
    const bodyDiv = li.querySelector('.cards-card-body');
    let textEl = null;
    if (bodyDiv) {
      // Use the body div as is for text
      textEl = fieldCommentedFragment('text', bodyDiv);
    }

    return [imageEl, textEl];
  });

  // Assemble table data
  const tableData = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element with block table
  element.replaceWith(blockTable);
}
