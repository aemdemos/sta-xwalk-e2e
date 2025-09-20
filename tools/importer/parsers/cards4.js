/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each <li> is a card
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Defensive: Get image container and body container
    const imgDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // Find the <img> inside the image container
    let imgEl = null;
    if (imgDiv) {
      // Prefer <img> inside <picture>
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgEl = picture.querySelector('img');
      }
    }

    // Defensive: Only add row if both image and body exist
    if (imgEl && bodyDiv) {
      // For text: extract title (strong) and description (next <p>)
      const textEls = [];
      const paragraphs = bodyDiv.querySelectorAll('p');
      if (paragraphs.length) {
        // First <p> may contain <strong> (title)
        const firstP = paragraphs[0];
        const strong = firstP.querySelector('strong');
        if (strong) {
          // Make a heading element for the title
          const heading = document.createElement('strong');
          heading.textContent = strong.textContent;
          textEls.push(heading);
        } else {
          textEls.push(firstP);
        }
        // If there's a second <p>, it's the description
        if (paragraphs.length > 1) {
          textEls.push(paragraphs[1]);
        }
      }
      rows.push([
        imgEl, // Image cell
        textEls // Text cell (array of elements)
      ]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
