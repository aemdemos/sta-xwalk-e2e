/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero-wrapper
  const heroWrapper = element.querySelector('.hero-wrapper');
  let heroContentDiv;
  if (heroWrapper) {
    // hero block is inside hero-wrapper
    const heroBlock = heroWrapper.querySelector('.hero');
    if (heroBlock) {
      const innerBlockDivs = heroBlock.querySelectorAll('div');
      if (innerBlockDivs.length > 0) {
        // The content is typically in the deepest div
        heroContentDiv = innerBlockDivs[innerBlockDivs.length - 1];
      }
    }
  }
  // Fallback if any missing
  if (!heroContentDiv) heroContentDiv = element;

  // HEADER: always 'Hero'
  const headerRow = ['Hero'];

  // IMAGE ROW: Extract <picture> or <img> as-is, reference existing element
  let imageEl = null;
  // In this structure, picture is inside a <p>. It may or may not be present.
  if (heroContentDiv) {
    const imgP = Array.from(heroContentDiv.querySelectorAll('p')).find(p => p.querySelector('picture, img'));
    if (imgP) {
      const pic = imgP.querySelector('picture');
      if (pic) imageEl = pic;
      else {
        const img = imgP.querySelector('img');
        if (img) imageEl = img;
      }
    } else {
      // fallback: first picture or img directly under heroContentDiv
      const pic = heroContentDiv.querySelector('picture');
      if (pic) imageEl = pic;
      else {
        const img = heroContentDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }
  }
  const imageRow = [imageEl || ''];

  // TEXT ROW: gather all main text elements after the image row
  // We skip the P containing the picture
  const textEls = [];
  if (heroContentDiv) {
    // Get all children after the image-containing <p>
    const children = Array.from(heroContentDiv.children);
    for (const child of children) {
      // skip if picture-containing p
      if ((child.tagName === 'P' && child.querySelector('picture, img'))) continue;
      // skip empty <p> if any (but keep heading and nonempty p)
      if (child.tagName === 'P' && child.textContent.trim() === '') continue;
      textEls.push(child);
    }
  }
  // If textEls is empty, insert an empty cell, else all text elements
  const textRow = [textEls.length === 0 ? '' : (textEls.length === 1 ? textEls[0] : textEls)];

  // Construct cells
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
