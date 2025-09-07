/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all carousel items (slides)
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header row
  const headerRow = ['Carousel (carousel23)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Defensive: find teaser block inside each item
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- IMAGE CELL ---
    // Find image container and the <img> element
    let imageCell = '';
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      const cmpImage = imageContainer.querySelector('.cmp-image');
      if (cmpImage) {
        const img = cmpImage.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }

    // --- TEXT CELL ---
    const textContent = [];
    // Title (h2)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      textContent.push(title);
    }
    // Description (div or p)
    const description = teaser.querySelector('.cmp-teaser__description');
    if (description) {
      textContent.push(description);
    }
    // CTA link (a)
    const actionContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('a');
      if (cta) {
        textContent.push(cta);
      }
    }

    // Add row: [image, text]
    rows.push([
      imageCell,
      textContent.length ? textContent : '',
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
