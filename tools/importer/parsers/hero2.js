/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name
  const headerRow = ['Hero'];

  // Image row: find the background image (img inside picture)
  let heroImg = '';
  const picture = element.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      heroImg = img;
    }
  }
  const imageRow = [heroImg ? heroImg : ''];

  // Text row: title (h1), subheading (h2/h3), call-to-action, and other content after image
  const textContent = [];
  // Find <h1>, <h2>, <h3> that are not in the image area
  // Only include those after the image, or all in practice since this block is simple
  const mainBlock = element.querySelector('.hero.block, .hero-block, .hero');
  let mainContentParent = mainBlock ? mainBlock : element;
  // After picture and image
  // Get the container div with the content (after image)
  // In provided HTML, after <picture> <img>, the following <h1> and <p> is the content
  // But for resilience, grab all headings and paragraphs except <p> containing <picture>
  // Look for direct descendants of first inner <div>
  let contentDiv = null;
  const innerDivs = mainContentParent.querySelectorAll('div');
  if (innerDivs.length > 0) {
    contentDiv = innerDivs[0];
  } else {
    contentDiv = mainContentParent;
  }

  // Find all children after image
  let foundImage = false;
  for (const child of contentDiv.children) {
    // Skip the <p><picture>...</picture></p> for image
    if (!foundImage && child.querySelector && child.querySelector('picture')) {
      foundImage = true;
      continue;
    }
    if (!foundImage) continue;
    // Collect <h1>, <h2>, <h3>, <h4>, <p>, <a> (if present)
    if (
      child.tagName &&
      (/^H[1-4]$/.test(child.tagName) || child.tagName === 'P' || child.tagName === 'A')
    ) {
      if (child.textContent.trim().length > 0) {
        textContent.push(child);
      }
    }
  }

  // Edge case: if textContent is empty (image and all text are within same parent, as in provided HTML), search after <picture> in the parent
  if (textContent.length === 0 && contentDiv.children.length > 0) {
    let afterImage = false;
    for (const child of contentDiv.children) {
      if (child.querySelector && child.querySelector('picture')) {
        afterImage = true;
        continue;
      }
      if (!afterImage) continue;
      if (
        child.tagName &&
        (/^H[1-4]$/.test(child.tagName) || child.tagName === 'P' || child.tagName === 'A')
      ) {
        if (child.textContent.trim().length > 0) {
          textContent.push(child);
        }
      }
    }
  }

  // Final fallback: if textContent is still empty, get all h1-h4, p, a under contentDiv, except paragraphs with picture/img
  if (textContent.length === 0) {
    const allContent = contentDiv.querySelectorAll('h1, h2, h3, h4, p, a');
    allContent.forEach(el => {
      if (
        el.tagName === 'P' && el.querySelector('picture')
      ) return;
      if (el.textContent.trim().length > 0) textContent.push(el);
    });
  }

  const textRow = [textContent.length ? textContent : ''];

  // Compose the rows
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];
  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
