/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the cards block (ul > li structure)
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each card is a <li>
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Image cell: find the image container
    const imgContainer = li.querySelector('.cards-card-image');
    let imageEl = null;
    if (imgContainer) {
      // Use the <picture> element if present, else fallback to <img>
      imageEl = imgContainer.querySelector('picture') || imgContainer.querySelector('img');
    }

    // Text cell: find the body container
    const bodyContainer = li.querySelector('.cards-card-body');
    let textCellContent = [];
    if (bodyContainer) {
      // Defensive: gather all children (usually <p> elements)
      bodyContainer.childNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element
          textCellContent.push(node);
        }
      });
    }
    // If only one element, don't wrap in array
    const textCell = textCellContent.length === 1 ? textCellContent[0] : textCellContent;

    // Add row: [image, text]
    rows.push([imageEl, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
