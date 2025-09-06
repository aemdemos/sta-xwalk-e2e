/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a teaser
  function getTeaserImage(teaser) {
    // Find the image inside the teaser
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (!imgContainer) return null;
    // Find the <img> inside
    const img = imgContainer.querySelector('img');
    return img;
  }

  // Helper to extract the text content (title, description, CTA) from a teaser
  function getTeaserText(teaser) {
    const content = teaser.querySelector('.cmp-teaser__content');
    if (!content) return null;
    // We'll collect title, description, and CTA if present
    const fragment = document.createDocumentFragment();
    // Title
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      // Use <h2> as in the source
      fragment.appendChild(title);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      fragment.appendChild(desc);
    }
    // CTA (action link)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      fragment.appendChild(cta);
    }
    return fragment.childNodes.length > 0 ? fragment : null;
  }

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Build the table rows
  const rows = [];
  // Header row as per requirements
  rows.push(['Carousel (carousel22)']);

  slides.forEach((slide) => {
    // Each slide contains a .teaser
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;
    // First cell: image (mandatory)
    const img = getTeaserImage(teaser);
    // Second cell: text content (title, description, CTA)
    const textContent = getTeaserText(teaser);
    // Defensive: only add row if image exists
    if (img) {
      // If textContent is empty, pass an empty string for the cell
      rows.push([img, textContent || '']);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
