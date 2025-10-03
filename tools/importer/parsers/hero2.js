/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the hero image (picture or img)
  function findHeroImage(el) {
    // Look for picture > img or img directly
    const pic = el.querySelector('picture');
    if (pic) return pic;
    const img = el.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper: get the main heading (h1, h2, etc.)
  function findHeading(el) {
    for (let i = 1; i <= 3; i++) {
      const h = el.querySelector(`h${i}`);
      if (h) return h;
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero2)'];

  // 2. Image row
  const heroImage = findHeroImage(element);
  const imageRow = [heroImage ? heroImage : ''];

  // 3. Content row: heading, subheading, CTA (if any)
  // We'll collect heading and any paragraphs after heading
  let contentCell = [];
  const heading = findHeading(element);
  if (heading) contentCell.push(heading);

  // Subheading: any paragraph or subheading after the main heading
  if (heading) {
    let next = heading.nextElementSibling;
    while (next) {
      // Only add paragraphs or subheadings (h2/h3)
      if (next.tagName === 'P' || next.tagName === 'H2' || next.tagName === 'H3') {
        // Only add if it has text or children (skip empty <p>)
        if (next.textContent.trim() || next.children.length > 0) {
          contentCell.push(next);
        }
      }
      next = next.nextElementSibling;
    }
  }

  // If nothing was found for content, fallback to all text content
  if (contentCell.length === 0) {
    const paras = element.querySelectorAll('p');
    paras.forEach(p => {
      if (p.textContent.trim()) contentCell.push(p);
    });
  }

  // 4. Compose table
  const tableCells = [
    headerRow,
    imageRow,
    [contentCell.length ? contentCell : ''],
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
