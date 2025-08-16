/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block (should be a wrapper containing .cards.block -> ul -> li)
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  const rows = [['Cards']]; // Header row
  lis.forEach((li) => {
    // Each card has image in .cards-card-image and text in .cards-card-body
    const imageDiv = li.querySelector('.cards-card-image');
    let imageContent = null;
    if (imageDiv) {
      // Use the <picture> if present, else the imageDiv itself
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageContent = picture;
      } else {
        const img = imageDiv.querySelector('img');
        imageContent = img ? img : imageDiv;
      }
    }
    const bodyDiv = li.querySelector('.cards-card-body');
    // Use bodyDiv directly to maintain formatting and structure (bold, paragraphs)
    const row = [imageContent, bodyDiv];
    rows.push(row);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
