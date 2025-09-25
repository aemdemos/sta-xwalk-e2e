/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest content wrapper (usually the block)
  const blockEl = element.querySelector('.hero.block') || element;
  // The actual content is usually nested two divs deep
  let innerContent = blockEl;
  const innerDivs = blockEl.querySelectorAll(':scope > div');
  if (innerDivs.length > 0) {
    innerContent = innerDivs[0];
    const deeperDivs = innerContent.querySelectorAll(':scope > div');
    if (deeperDivs.length > 0) {
      innerContent = deeperDivs[0];
    }
  }

  // Find image (background)
  let imageEl = null;
  const picture = innerContent.querySelector('picture');
  if (picture) {
    imageEl = picture.querySelector('img');
  }

  // Find heading (h1, h2, etc.)
  let headingEl = innerContent.querySelector('h1, h2, h3, h4, h5, h6');

  // Find subheading (next heading after main heading)
  let subheadingEl = null;
  if (headingEl) {
    let sib = headingEl.nextElementSibling;
    while (sib) {
      if (/^H[1-6]$/.test(sib.tagName)) {
        subheadingEl = sib;
        break;
      }
      sib = sib.nextElementSibling;
    }
  }

  // Find CTA (a link inside a p or div)
  let ctaEl = null;
  const link = innerContent.querySelector('a[href]');
  if (link) {
    ctaEl = link;
  }

  // Find paragraph(s) after heading
  let paraEls = [];
  if (headingEl) {
    let sib = headingEl.nextElementSibling;
    while (sib) {
      if (sib.tagName === 'P' && sib.textContent.trim()) {
        paraEls.push(sib);
      }
      sib = sib.nextElementSibling;
    }
  }
  if (!headingEl) {
    paraEls = Array.from(innerContent.querySelectorAll('p')).filter(p => p.textContent.trim());
  }

  // Build rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentArr = [];
  if (headingEl) contentArr.push(headingEl);
  if (subheadingEl) contentArr.push(subheadingEl);
  if (paraEls.length) contentArr.push(...paraEls);
  if (ctaEl) contentArr.push(ctaEl);
  if (contentArr.length === 0) {
    contentArr.push(innerContent);
  }
  const contentRow = [contentArr];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(blockTable);
}
