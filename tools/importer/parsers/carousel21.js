/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a carousel item
  function getImageEl(item) {
    // Find the teaser image wrapper
    const imgWrapper = item.querySelector('.cmp-teaser__image');
    if (!imgWrapper) return null;
    // Find the actual <img> inside
    const img = imgWrapper.querySelector('img');
    return img || null;
  }

  // Helper to extract the text content (title, description, CTA) from a carousel item
  function getTextContentEl(item) {
    const content = document.createElement('div');
    content.className = 'carousel-slide-content';
    // Title
    const title = item.querySelector('.cmp-teaser__title');
    if (title) {
      // Use h2 as in source, but could be changed if needed
      const h = document.createElement('h2');
      h.textContent = title.textContent.trim();
      content.appendChild(h);
    }
    // Description
    const desc = item.querySelector('.cmp-teaser__description');
    if (desc) {
      // If description contains block elements (like <p>), append as-is
      if (desc.children.length > 0) {
        Array.from(desc.childNodes).forEach((node) => {
          content.appendChild(node.cloneNode(true));
        });
      } else {
        // Otherwise, wrap in <p>
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        content.appendChild(p);
      }
    }
    // CTA (button/link)
    const cta = item.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Place CTA at the bottom, as in the markdown example
      const ctaDiv = document.createElement('div');
      ctaDiv.appendChild(cta);
      content.appendChild(ctaDiv);
    }
    // If nothing was found, return null
    if (!content.hasChildNodes()) return null;
    return content;
  }

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');
  if (!items.length) return;

  // Build the table rows
  const rows = [];
  // Header row as per block spec
  rows.push(['Carousel (carousel21)']);

  items.forEach((item) => {
    // First cell: image only
    const img = getImageEl(item);
    // Defensive: skip if no image
    if (!img) return;
    // Second cell: text content (title, desc, cta)
    const textContent = getTextContentEl(item);
    rows.push([img, textContent || '']);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
