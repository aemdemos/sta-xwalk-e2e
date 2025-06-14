/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block element (either .cards.block or the <ul> inside it)
  let block = element.querySelector('.cards.block');
  if (!block) block = element;

  // Find the <ul> containing all cards
  let ul = block.querySelector('ul');
  if (!ul && block.tagName === 'UL') ul = block;
  if (!ul) return;

  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Helper: filter out empty text nodes without using Node constant
  function isNotEmptyTextNode(n) {
    return !(n.nodeType === 3 && (!n.textContent || !n.textContent.trim()));
  }

  // Process each <li> as a card
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // IMAGE CELL: Only the <picture> or <img>
    let imgCell = null;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      const pic = imgDiv.querySelector('picture');
      const img = imgDiv.querySelector('img');
      if (pic) imgCell = pic;
      else if (img) imgCell = img;
    }
    // TEXT CELL: Only the child nodes of .cards-card-body
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = Array.from(bodyDiv.childNodes).filter(isNotEmptyTextNode);
    }
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
