/* global WebImporter */
export default function parse(element, { document }) {
  // Get the content wrapper inside the hero block
  const contentWrapper = element.querySelector(':scope > div > div');
  if (!contentWrapper) return;

  // Find the <picture> or <img> for the background image
  let imageEl = null;
  const picture = contentWrapper.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = contentWrapper.querySelector('img');
    if (img) imageEl = img;
  }

  // Gather all content nodes for the content cell (title, subheading, CTA)
  // The content cell should include all elements except the image
  let contentNodes = [];
  for (const child of contentWrapper.children) {
    if (child === picture || (imageEl && child === imageEl)) continue;
    if (child.textContent && child.textContent.trim()) {
      contentNodes.push(child);
    }
  }

  // If nothing found, fallback to heading
  if (contentNodes.length === 0) {
    const heading = contentWrapper.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentNodes.push(heading);
  }

  // Ensure the table always has 3 rows: header, image, content
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentNodes.length ? contentNodes : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
