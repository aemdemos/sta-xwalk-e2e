/* global WebImporter */
export default function parse(element, { document }) {
  // Find the direct .cards.block inside the element
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // The cards are inside a <ul>, each <li> is a card
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const cardItems = Array.from(ul.children);

  // Prepare table rows: first row is the header
  const rows = [['Cards']];

  // For each card, extract the image and text content
  cardItems.forEach(li => {
    // Image cell: .cards-card-image (should contain a <picture> or <img>)
    const imageDiv = li.querySelector('.cards-card-image');
    let imageContent = null;
    if (imageDiv) {
      // Reference the <picture> if present, otherwise the <img>
      imageContent = imageDiv.querySelector('picture') || imageDiv.querySelector('img');
    }

    // Text cell: .cards-card-body
    const textDiv = li.querySelector('.cards-card-body');
    // Reference the whole textDiv (contains heading, description, etc)
    // Only add the row if at least image or text is present
    if (imageContent || textDiv) {
      rows.push([imageContent, textDiv]);
    }
  });

  if (rows.length > 1) {
    // Create the block table only if there is at least one card
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
