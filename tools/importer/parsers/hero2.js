/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest child containing the hero content
  let heroContent = element;
  // Traverse down to the innermost div with actual content
  while (heroContent && heroContent.children.length === 1 && heroContent.firstElementChild.tagName === 'DIV') {
    heroContent = heroContent.firstElementChild;
  }

  // At this point, heroContent should contain the image and heading
  // Find image (picture or img)
  let imageEl = null;
  const picture = heroContent.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    // fallback: find img
    const img = heroContent.querySelector('img');
    if (img) imageEl = img;
  }

  // Find heading (h1, h2, etc.) and subheading/paragraphs
  let heading = null;
  let subheading = null;
  let cta = null;
  // Find all direct children that are not picture
  const children = Array.from(heroContent.children);
  for (const child of children) {
    if (!heading && /^H[1-6]$/.test(child.tagName)) {
      heading = child;
    } else if (!subheading && child.tagName === 'P' && child.textContent.trim()) {
      subheading = child;
    } else if (!cta && child.tagName === 'A') {
      cta = child;
    }
  }

  // Compose table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Compose text row: heading, subheading, cta (if present)
  const textRowContent = [];
  if (heading) textRowContent.push(heading);
  if (subheading) textRowContent.push(subheading);
  if (cta) textRowContent.push(cta);
  const textRow = [textRowContent.length > 0 ? textRowContent : ''];

  const cells = [headerRow, imageRow, textRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
