/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the <ul> containing cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Get all <li> card items
  const cards = Array.from(ul.children);

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each card: image in col 1, text in col 2
  cards.forEach((li) => {
    // Defensive: Find image container and body
    const imgDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // Find the image (use <picture> or <img> directly)
    let imageEl = null;
    if (imgDiv) {
      // Prefer <picture> if present
      imageEl = imgDiv.querySelector('picture') || imgDiv.querySelector('img');
    }

    // For text: gather all <p> in bodyDiv
    let textContent = [];
    if (bodyDiv) {
      const paragraphs = Array.from(bodyDiv.querySelectorAll('p'));
      textContent = paragraphs;
    }

    // Defensive: fallback if no image or text
    if (!imageEl && textContent.length === 0) return;

    // Add row: [image, text]
    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
