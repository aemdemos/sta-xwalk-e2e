/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cards list (ul) inside the provided element
  let cardsList = element.querySelector('ul');
  if (!cardsList) {
    // fallback: sometimes .cards.block may contain cards directly (less likely, but safe fallback)
    cardsList = element.querySelector('.cards.block');
  }
  if (!cardsList) return;

  // Retrieve all card <li> elements
  const cards = Array.from(cardsList.querySelectorAll('li'));

  // Prepare the table rows array: header first
  const tableRows = [['Cards']];

  // For each card, extract image and text content
  cards.forEach((card) => {
    // Extract image/icon from .cards-card-image
    let imageCell = '';
    const imageDiv = card.querySelector('.cards-card-image');
    if (imageDiv) {
      // If there is a <picture> inside, use it directly (as per HTML)
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        imageCell = imageDiv;
      }
    }

    // Extract text (title/description/cta) from .cards-card-body
    let textCell = '';
    const bodyDiv = card.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }
    tableRows.push([imageCell, textCell]);
  });

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
