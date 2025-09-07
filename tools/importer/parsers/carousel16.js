/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if carousel structure is present
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Table header row
  const headerRow = ['Carousel (carousel16)'];
  const rows = [headerRow];

  // Find all carousel items (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    // First cell: Image (mandatory)
    let imageCell = null;
    const imageWrapper = item.querySelector('.image');
    if (imageWrapper) {
      const img = imageWrapper.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        imageCell = imageWrapper;
      }
    }

    // Second cell: Text content (always present, empty if none)
    let textCell = '';
    // Look for headings, paragraphs, links, etc. that are not inside the image wrapper
    const textFragments = [];
    Array.from(item.children).forEach((child) => {
      if (child !== imageWrapper) {
        if (child.textContent.trim()) {
          textFragments.push(child.cloneNode(true));
        }
      }
    });
    if (textFragments.length > 0) {
      const div = document.createElement('div');
      textFragments.forEach((frag) => div.appendChild(frag));
      textCell = div;
    }

    // Always push two columns per row (second cell empty if no text)
    rows.push([imageCell, textCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
