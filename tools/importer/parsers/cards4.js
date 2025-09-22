/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cards block (could be the element itself or a child)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards');
  }
  if (!cardsBlock) return;

  // Find all card <li> elements
  const list = cardsBlock.querySelector('ul');
  if (!list) return;
  const cards = Array.from(list.children);

  // Prepare table rows
  const rows = [];
  // Header row as specified
  rows.push(['Cards (cards4)']);

  cards.forEach((li) => {
    // Find image (first cell)
    const imageDiv = li.querySelector('.cards-card-image');
    let imageEl = null;
    if (imageDiv) {
      // Use the <picture> or <img> element directly
      const pic = imageDiv.querySelector('picture');
      if (pic) {
        imageEl = pic;
      } else {
        // fallback to img if picture is missing
        const img = imageDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Find text content (second cell)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textContent = [];
    if (bodyDiv) {
      // Title: look for <strong> in <p> or just the first <p>
      const paragraphs = bodyDiv.querySelectorAll('p');
      if (paragraphs.length > 0) {
        const firstP = paragraphs[0];
        const strong = firstP.querySelector('strong');
        if (strong) {
          // Use <strong> as heading (convert to <h3>)
          const h = document.createElement('h3');
          h.textContent = strong.textContent;
          textContent.push(h);
        } else {
          // fallback: use first <p> as heading
          const h = document.createElement('h3');
          h.textContent = firstP.textContent;
          textContent.push(h);
        }
      }
      // Description: any <p> after the first
      for (let i = 1; i < paragraphs.length; i++) {
        textContent.push(paragraphs[i]);
      }
    }

    // Defensive: fallback if no textContent
    if (textContent.length === 0 && bodyDiv) {
      textContent.push(bodyDiv);
    }

    rows.push([
      imageEl || '',
      textContent.length === 1 ? textContent[0] : textContent,
    ]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original block
  element.replaceWith(table);
}
