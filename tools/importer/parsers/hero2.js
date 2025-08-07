/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the deepest hero block content
  // This usually is: .section.hero-container > .hero-wrapper > .hero.block > div > div
  let contentRoot = element;
  const heroWrapper = element.querySelector(':scope > .hero-wrapper');
  if (heroWrapper) {
    const heroBlock = heroWrapper.querySelector(':scope > .hero.block');
    if (heroBlock) {
      // The inner block may have two divs: take the inner-most div
      const innerDivs = heroBlock.querySelectorAll(':scope > div > div');
      if (innerDivs.length > 0) {
        contentRoot = innerDivs[0];
      } else {
        // fallback: maybe just one div
        const firstDiv = heroBlock.querySelector(':scope > div');
        if (firstDiv) {
          contentRoot = firstDiv;
        } else {
          contentRoot = heroBlock;
        }
      }
    } else {
      contentRoot = heroWrapper;
    }
  }

  // 2. Extract picture or img for background image (row 2)
  let pictureEl = contentRoot.querySelector('picture');
  let imgEl = null;
  if (pictureEl) {
    imgEl = pictureEl.querySelector('img');
  } else {
    imgEl = contentRoot.querySelector('img');
  }

  // 3. Extract heading, subheading, and CTA for content (row 3)
  // We'll take all heading elements (h1-h6), all paragraphs except those containing only an image, and links.
  const contentCells = [];

  // First, headings
  const headings = contentRoot.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(h => contentCells.push(h));
  // Then, paragraphs that do NOT only contain an image/picture
  const paragraphs = contentRoot.querySelectorAll('p');
  paragraphs.forEach(p => {
    // Exclude paragraphs that ONLY have an image or picture (used for background image)
    if (
      !(p.childNodes.length === 1 && (p.firstElementChild && (p.firstElementChild.tagName === 'PICTURE' || p.firstElementChild.tagName === 'IMG')))
    ) {
      // Also skip empty paragraphs
      if (p.textContent.trim().length > 0) {
        contentCells.push(p);
      }
    }
  });
  // Any other content? (Could include CTA links, but in this case, not present)

  // If no headings or paragraphs found, put an empty string
  if (contentCells.length === 0) {
    contentCells.push('');
  }

  // Compose table rows as per Hero block spec
  const rows = [];
  rows.push(['Hero']); // header EXACTLY matches block name
  // 2nd row: background image (picture or img or empty)
  if (pictureEl) {
    rows.push([pictureEl]);
  } else if (imgEl) {
    rows.push([imgEl]);
  } else {
    rows.push(['']);
  }
  // 3rd row: content (title, subheading, CTA)
  rows.push([contentCells]);
  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
