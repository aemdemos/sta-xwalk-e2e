/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the deepest content container
  let contentRoot = element;
  // Traverse down to find the actual content div
  while (contentRoot && contentRoot.children.length === 1 && contentRoot.firstElementChild) {
    contentRoot = contentRoot.firstElementChild;
  }

  // Get all direct children of the content root
  const children = Array.from(contentRoot.children);

  // Find image (picture or img)
  let imageEl = null;
  for (const child of children) {
    // Look for <picture> or <img> inside a <p>
    if (child.tagName === 'P') {
      const pic = child.querySelector('picture');
      if (pic) {
        imageEl = pic;
        break;
      }
      const img = child.querySelector('img');
      if (img) {
        imageEl = img;
        break;
      }
    }
    // Direct <picture> or <img>
    if (child.tagName === 'PICTURE') {
      imageEl = child;
      break;
    }
    if (child.tagName === 'IMG') {
      imageEl = child;
      break;
    }
  }

  // Find heading (h1, h2, h3, etc.) and supporting text
  let headingEl = null;
  let subheadingEl = null;
  let ctaEl = null;
  let textEls = [];
  for (const child of children) {
    if (/^H[1-6]$/.test(child.tagName)) {
      if (!headingEl) {
        headingEl = child;
      } else if (!subheadingEl) {
        subheadingEl = child;
      }
    } else if (child.tagName === 'P') {
      // If paragraph contains a link, treat as CTA
      const link = child.querySelector('a');
      if (link && !ctaEl) {
        ctaEl = child;
      } else {
        // If not empty, treat as supporting text
        if (child.textContent.trim().length > 0) {
          textEls.push(child);
        }
      }
    }
  }

  // Compose the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];

  // Compose content cell (title, subheading, CTA, supporting text)
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (subheadingEl) contentCell.push(subheadingEl);
  textEls.forEach(el => contentCell.push(el));
  if (ctaEl) contentCell.push(ctaEl);

  // Always add a third row, even if empty
  const thirdRow = [contentCell.length > 0 ? contentCell : ''];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    thirdRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
