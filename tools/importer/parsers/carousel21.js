/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items (each .cmp-carousel__item)
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header row
  const headerRow = ['Carousel (carousel21)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Defensive: find teaser block inside each slide
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Find image (first column)
    let imageEl = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      // Find the actual <img> inside
      imageEl = teaserImage.querySelector('img');
    }

    // Compose text content (second column)
    const textContent = [];
    const teaserContent = teaser.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (h2)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) textContent.push(title);
      // Description
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      // CTA link
      const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (actionContainer) {
        const cta = actionContainer.querySelector('.cmp-teaser__action-link');
        if (cta) textContent.push(cta);
      }
    }

    // Add row: [image, textContent]
    rows.push([
      imageEl,
      textContent.length ? textContent : ''
    ]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
