/* global WebImporter */
export default function parse(element, { document }) {
  // Only process carousel blocks
  if (!element || !element.classList.contains('carousel')) return;

  // Table header row
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Each slide is a .cmp-carousel__item
  const items = content.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // Find image (mandatory)
    let imgEl = item.querySelector('img');
    if (!imgEl) return; // Defensive: skip if no image

    // Use the actual <img> element from the DOM
    const imageCell = imgEl;

    // Prepare text cell (optional)
    let textCell = '';
    // Try to find a heading/caption: prefer <meta itemprop="caption">, then title, then alt
    let caption = '';
    const metaCaption = item.querySelector('meta[itemprop="caption"]');
    if (metaCaption && metaCaption.content) {
      caption = metaCaption.content;
    } else if (imgEl.getAttribute('title')) {
      caption = imgEl.getAttribute('title');
    } else if (imgEl.getAttribute('alt')) {
      caption = imgEl.getAttribute('alt');
    }
    if (caption) {
      const heading = document.createElement('h2');
      heading.textContent = caption;
      textCell = heading;
    }

    // Look for additional text content inside the slide (e.g., description, links)
    // Collect all text nodes and links except the image/caption
    // We'll look for paragraphs, links, etc. inside the item, but outside the image wrapper
    const imageWrapper = item.querySelector('.image');
    let additionalContent = [];
    if (imageWrapper) {
      // Get all siblings after the image wrapper
      let sibling = imageWrapper.nextElementSibling;
      while (sibling) {
        // Only add if it's not empty
        if (sibling.textContent.trim() || sibling.querySelector('a')) {
          additionalContent.push(sibling.cloneNode(true));
        }
        sibling = sibling.nextElementSibling;
      }
    }
    // If there is additional content, append it to the textCell
    if (additionalContent.length > 0) {
      // If textCell is empty, create a div to hold content
      let container;
      if (textCell) {
        container = document.createElement('div');
        container.appendChild(textCell);
      } else {
        container = document.createElement('div');
      }
      additionalContent.forEach(node => container.appendChild(node));
      textCell = container;
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
