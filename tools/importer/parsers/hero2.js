/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero block content container
  let contentDiv = element.querySelector('.hero.block > div > div');
  if (!contentDiv) {
    // fallback if structure is slightly different
    const blockDiv = element.querySelector('.hero.block');
    if (blockDiv && blockDiv.firstElementChild) {
      contentDiv = blockDiv.firstElementChild;
    } else {
      contentDiv = element; // fallback to whole element
    }
  }

  // 2. Find background image: prefer <picture>, fallback to first <img>
  let picture = contentDiv.querySelector('picture');
  let heroImage = picture ? picture : contentDiv.querySelector('img');

  // 3. Find heading (h1-h6)
  let heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');

  // 4. Find additional text after heading and not containing picture/image (subheading, cta, etc)
  //    Only <p> tags with actual text content (ignore empty <p> or <p> only with image)
  const paragraphs = Array.from(contentDiv.children)
    .filter(child => child.tagName === 'P' && !child.querySelector('picture, img') && child.textContent.trim().length > 0);

  // 5. Compose rows
  const rows = [];
  // Header row
  rows.push(['Hero']);
  // Image row (may be blank)
  rows.push([heroImage || '']);
  // Text row (heading + subheading, if any)
  const textEls = [];
  if (heading) textEls.push(heading);
  if (paragraphs.length > 0) textEls.push(...paragraphs);
  rows.push([textEls.length === 1 ? textEls[0] : (textEls.length > 1 ? textEls : '')]);

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
