/* global WebImporter */
export default function parse(element, { document }) {
  // Only process carousel blocks
  if (!element.classList.contains('carousel')) return;

  // Table header row as required
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  // Find the carousel inner container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides (items)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    // Find image element (mandatory)
    let imgEl = null;
    const imageContainer = item.querySelector('.cmp-image');
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }
    // Defensive: If no image, skip
    if (!imgEl) return;

    // Second cell: text content (optional)
    let textContent = '';
    Array.from(item.children).forEach((child) => {
      if (!child.classList.contains('image')) {
        textContent += child.textContent.trim() ? child.textContent.trim() + '\n' : '';
      }
    });
    textContent = textContent.trim();

    // Always push two columns per row (second cell empty if no text)
    rows.push([imgEl, textContent || '']);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
