/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all carousel items (slides)
  const items = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));
  if (!items.length) return;

  // Table header row
  const headerRow = ['Carousel (carousel11)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find teaser block inside each item
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- IMAGE CELL ---
    let imageCell = '';
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      // Find the actual image element
      const img = teaserImage.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    const contentCellElements = [];
    const teaserContent = teaser.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (h2)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) contentCellElements.push(title);
      // Description (div or p)
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) contentCellElements.push(desc);
      // CTA (link)
      const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const cta = ctaContainer.querySelector('a');
        if (cta) contentCellElements.push(cta);
      }
    }
    // Defensive: if no text, use empty string
    const textCell = contentCellElements.length ? contentCellElements : '';

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
