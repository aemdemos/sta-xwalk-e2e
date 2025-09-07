/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the teaser content and image blocks
  const content = Array.from(element.children).find(child => child.classList.contains('cmp-teaser'));
  if (!content) return;

  // Get image element (mandatory)
  let imgEl = null;
  const imageContainer = content.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }

  // Get text content (title, description, CTA)
  const textFragments = [];
  const teaserContent = content.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Title (optional)
    const titleEl = teaserContent.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Use heading element directly
      textFragments.push(titleEl);
    }
    // Description (optional)
    const descEl = teaserContent.querySelector('.cmp-teaser__description');
    if (descEl) {
      textFragments.push(descEl);
    }
    // CTA (optional)
    const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const ctaLink = actionContainer.querySelector('a');
      if (ctaLink) {
        textFragments.push(ctaLink);
      }
    }
  }

  // Build table rows
  const headerRow = ['Carousel (carousel27)'];
  const rows = [headerRow];

  // Only add row if image is present
  if (imgEl) {
    rows.push([
      imgEl,
      textFragments.length ? textFragments : ''
    ]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
