/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process the main magazine grid
  if (!element.classList.contains('container')) return;

  // Helper: Get immediate children
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the featured article teaser
  const featuredTeaser = grid.querySelector('.cmp-teaser--featured');

  // Find the image list (all articles)
  const imageList = grid.querySelector('.image-list.list ul.cmp-image-list');

  // Find the Members Only teasers
  const memberTeasers = Array.from(grid.querySelectorAll('.cmp-teaser--list.cmp-teaser--secure'));

  // --- Cards Block Construction ---
  const headerRow = ['Cards (cards4)'];
  const rows = [];

  // Featured Article Card
  if (featuredTeaser) {
    const teaserContent = featuredTeaser.querySelector('.cmp-teaser__content');
    const teaserImageWrap = featuredTeaser.querySelector('.cmp-teaser__image');
    let img = teaserImageWrap && teaserImageWrap.querySelector('img');
    if (img) {
      // Defensive: Use the image element directly
      // Text cell: pretitle, title, description, CTA
      const textCell = [];
      const pretitle = teaserContent.querySelector('.cmp-teaser__pretitle');
      if (pretitle) textCell.push(pretitle);
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) textCell.push(title);
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) textCell.push(desc);
      const cta = teaserContent.querySelector('.cmp-teaser__action-link');
      if (cta) textCell.push(cta);
      else {
        // Sometimes CTA is just text
        const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
        if (ctaContainer && ctaContainer.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = ctaContainer.textContent.trim();
          textCell.push(span);
        }
      }
      rows.push([img, textCell]);
    }
  }

  // All Articles Cards
  if (imageList) {
    const items = imageList.querySelectorAll('li.cmp-image-list__item');
    items.forEach((li) => {
      const article = li.querySelector('article');
      if (!article) return;
      // Image
      const imgWrap = article.querySelector('.cmp-image-list__item-image');
      let img = imgWrap && imgWrap.querySelector('img');
      // Text cell: title, description
      const textCell = [];
      const titleLink = article.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan) textCell.push(titleSpan);
      }
      const desc = article.querySelector('.cmp-image-list__item-description');
      if (desc) textCell.push(desc);
      rows.push([img, textCell]);
    });
  }

  // Members Only Cards
  memberTeasers.forEach((teaser) => {
    const content = teaser.querySelector('.cmp-teaser__content');
    const imageWrap = teaser.querySelector('.cmp-teaser__image');
    let img = imageWrap && imageWrap.querySelector('img');
    // Text cell: title, description, CTA
    const textCell = [];
    const title = content.querySelector('.cmp-teaser__title');
    if (title) textCell.push(title);
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) textCell.push(desc);
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) textCell.push(cta);
    else {
      // Sometimes CTA is just text
      const ctaContainer = content.querySelector('.cmp-teaser__action-container');
      if (ctaContainer && ctaContainer.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = ctaContainer.textContent.trim();
        textCell.push(span);
      }
    }
    rows.push([img, textCell]);
  });

  // Only build block if at least one card found
  if (rows.length > 0) {
    const cells = [headerRow, ...rows];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
