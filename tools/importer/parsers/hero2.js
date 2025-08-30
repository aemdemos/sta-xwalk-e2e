/* global WebImporter */
export default function parse(element, { document }) {
  // Safely get to the innermost content div
  // HTML structure: element > .hero-wrapper > .hero > div > div
  let innerDiv = null;
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (heroWrapper) {
    const heroBlock = heroWrapper.querySelector('.hero.block');
    if (heroBlock) {
      const blockDivs = heroBlock.querySelectorAll(':scope > div > div');
      if (blockDivs.length > 0) {
        innerDiv = blockDivs[0];
      }
    }
  }
  
  // Fallback: if not found, innerDiv may be in the hierarchy still
  if (!innerDiv) {
    innerDiv = element.querySelector('.hero-wrapper .hero > div > div') || element;
  }

  // Extract image (picture in first p)
  let picture = null;
  const pTags = innerDiv.querySelectorAll('p');
  for (let p of pTags) {
    const pic = p.querySelector('picture');
    if (pic) {
      picture = pic;
      break;
    }
  }

  // If no picture, leave blank cell (handle optional)
  // Extract heading (h1, h2, h3, etc.)
  let heading = null;
  for (let i = 1; i <= 6; i++) {
    const h = innerDiv.querySelector(`h${i}`);
    if (h) {
      heading = h;
      break;
    }
  }

  // To be resilient, collect also relevant subheading/paragraphs (text content)
  // Usually the heading is followed by subheading (h2/h3) and/or paragraph(s)
  // For this HTML, let's collect all headings (except the main one used) & paragraphs after the main heading
  let textCellContent = [];
  if (heading) {
    textCellContent.push(heading);
    // Also add all non-empty paragraphs and subheadings that appear after the main heading
    let node = heading.nextElementSibling;
    while (node) {
      if ((/^h[2-6]$/i).test(node.tagName) || (node.tagName === 'P' && node.textContent.trim())) {
        textCellContent.push(node);
      }
      node = node.nextElementSibling;
    }
  }

  // Compose table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [picture ? picture : ''];
  const textRow = [textCellContent.length > 0 ? textCellContent : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow
  ], document);
  element.replaceWith(table);
}
