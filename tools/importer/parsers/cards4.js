/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  // Get all <li> cards
  const lis = Array.from(ul.children);

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  lis.forEach((li) => {
    // Defensive: find image container and body container
    const imgDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // Find the image (use <picture> or <img> directly)
    let imageEl = null;
    if (imgDiv) {
      // Prefer the <picture> if present, else <img>
      imageEl = imgDiv.querySelector('picture') || imgDiv.querySelector('img');
    }

    // For text content, include all children of bodyDiv
    let textContent = [];
    if (bodyDiv) {
      textContent = Array.from(bodyDiv.childNodes).filter((node) => {
        // Only include elements and non-empty text nodes
        return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
      });
    }

    // Defensive: ensure at least one image and some text
    if (imageEl && textContent.length) {
      rows.push([
        imageEl,
        textContent.length === 1 ? textContent[0] : textContent
      ]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
