/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all carousel items (slides)
  const slideEls = Array.from(carouselContent.children).filter(
    (el) => el.classList.contains('cmp-carousel__item')
  );

  // Table header row
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // For each slide, extract image and text content
  slideEls.forEach((slide) => {
    // Defensive: Find teaser block inside slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- IMAGE CELL ---
    // Find image element inside teaser
    let imgEl = null;
    const teaserImageContainer = teaser.querySelector('.cmp-teaser__image');
    if (teaserImageContainer) {
      imgEl = teaserImageContainer.querySelector('img');
    }
    // If no image, skip this slide
    if (!imgEl) return;

    // --- TEXT CELL ---
    const textContent = [];
    // Title (h2)
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) textContent.push(titleEl);
    // Description (div or p)
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) textContent.push(descEl);
    // CTA link
    const ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) textContent.push(ctaLink);
    }

    // Add row: [image, textContent]
    rows.push([
      imgEl,
      textContent.length > 0 ? textContent : '',
    ]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
