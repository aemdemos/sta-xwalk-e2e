/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content block
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
    // Defensive: find teaser block inside the slide
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- IMAGE CELL ---
    // Find the image element inside the teaser
    let imageCell = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      // Find the actual <img> inside the image container
      const img = teaserImage.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        // fallback: use the whole teaserImage block
        imageCell = teaserImage;
      }
    }

    // --- CONTENT CELL ---
    const contentCellElements = [];
    // Title (h2)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) contentCellElements.push(title);
    // Description (div or p)
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) contentCellElements.push(desc);
    // CTA link
    const ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentCellElements.push(ctaLink);
    }

    // Defensive: if no content, add empty string
    const contentCell = contentCellElements.length > 0 ? contentCellElements : '';

    // Add row: [image, content]
    rows.push([imageCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
