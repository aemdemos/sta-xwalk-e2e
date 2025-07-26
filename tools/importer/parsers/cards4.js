/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards block inside the wrapper, or use element directly if it's the block
  let cardsBlock = element.querySelector('.cards.block') || element;

  // Find all the card items (li elements)
  let cardsList = cardsBlock.querySelector('ul');
  let cardItems = cardsList ? cardsList.querySelectorAll(':scope > li') : cardsBlock.querySelectorAll(':scope > li');

  const rows = [];
  // Header row matches the block name exactly as in the example
  rows.push(['Cards']);

  // For each card, create a [image, content] row
  cardItems.forEach((li) => {
    // Find the image (mandatory) in .cards-card-image
    let imgDiv = li.querySelector('.cards-card-image');
    let imageElem = null;
    if (imgDiv) {
      // Use the picture element directly if present, else fallback to img
      let pic = imgDiv.querySelector('picture');
      if (pic) {
        imageElem = pic;
      } else {
        let img = imgDiv.querySelector('img');
        if (img) imageElem = img;
      }
    }
    // Find the body (mandatory) in .cards-card-body
    let bodyDiv = li.querySelector('.cards-card-body');
    let bodyContent = null;
    if (bodyDiv) {
      // Use the children of the body div, not cloning, appending the actual children
      const fragments = Array.from(bodyDiv.childNodes).filter((n) => n.nodeType !== Node.COMMENT_NODE && !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()));
      bodyContent = fragments;
    }
    rows.push([imageElem, bodyContent]);
  });

  // Create the block table using the required helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
