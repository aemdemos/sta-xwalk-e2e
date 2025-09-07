/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header row
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Defensive: Find teaser block inside each item
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Image cell: find the image element
    let imageCell = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imageCell = teaserImage;
    } else {
      // fallback: look for any img inside the item
      const fallbackImg = item.querySelector('img');
      if (fallbackImg) imageCell = fallbackImg;
    }

    // Text cell: collect title, description, CTA
    const textCellContent = [];
    // Title (h2)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) textCellContent.push(title);
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) textCellContent.push(desc);
    // CTA link
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) textCellContent.push(cta);

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
