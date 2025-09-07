/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero');
  if (!heroTeaser) return;

  // Find image inside hero teaser
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  let imageEl = null;
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Find content inside hero teaser (title, subheading, CTA)
  const contentWrapper = heroTeaser.querySelector('.cmp-teaser__content');
  const contentCell = [];
  if (contentWrapper) {
    // Title
    const headingEl = contentWrapper.querySelector('h1, h2, h3, h4, h5, h6');
    if (headingEl) contentCell.push(headingEl);
    // Subheading (should be any p or div after the heading)
    let sib = headingEl ? headingEl.nextElementSibling : null;
    while (sib) {
      if (sib.tagName === 'P' || sib.tagName === 'DIV') contentCell.push(sib);
      sib = sib.nextElementSibling;
    }
    // CTA (any link or button inside contentWrapper)
    const ctas = contentWrapper.querySelectorAll('a, button');
    ctas.forEach((cta) => {
      if (!contentCell.includes(cta)) contentCell.push(cta);
    });
  }

  // Table header row (must match block name exactly)
  const headerRow = ['Hero (hero6)'];
  // Table image row (row 2)
  const imageRow = [imageEl ? imageEl : ''];
  // Table content row (row 3)
  const contentRow = [contentCell.length ? contentCell : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
