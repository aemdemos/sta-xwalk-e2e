/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Hero (hero2)'];

  // Find the hero image (picture or img)
  let imageEl = null;
  const picture = element.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = element.querySelector('img');
    if (img) imageEl = img;
  }
  const imageRow = [imageEl ? imageEl : ''];

  // Find content: title (heading), subheading, CTA (all in one cell)
  const contentItems = [];
  // Title (h1/h2/h3)
  const heading = element.querySelector('h1, h2, h3');
  if (heading) contentItems.push(heading);
  // Subheading (next heading after main heading, if any)
  let subheading = null;
  if (heading) {
    let sib = heading.nextElementSibling;
    while (sib) {
      if (/^H[1-6]$/.test(sib.tagName) && sib !== heading) {
        subheading = sib;
        contentItems.push(subheading);
        break;
      }
      sib = sib.nextElementSibling;
    }
  }
  // CTA: look for first <a> after heading
  let cta = null;
  if (heading) {
    let sib = heading.nextElementSibling;
    while (sib) {
      if (sib.querySelector && sib.querySelector('a')) {
        cta = sib.querySelector('a');
        contentItems.push(cta);
        break;
      }
      sib = sib.nextElementSibling;
    }
  }

  // The third row must always be present, even if empty
  const contentRow = [contentItems.length ? contentItems : ''];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
