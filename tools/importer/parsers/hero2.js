/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero.block inside the current element
  const heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) return;

  // Drill to the main content container
  // .hero.block > div > div (as in the provided HTML)
  let mainContent = heroBlock;
  const innerDivs = heroBlock.querySelectorAll(':scope > div');
  if (innerDivs.length > 0 && innerDivs[0].children.length > 0) {
    // the structure is hero.block > div > div
    mainContent = innerDivs[0].children[0];
  }

  // Extract image (picture or img)
  let imageEl = null;
  const picture = mainContent.querySelector('picture');
  if (picture) {
    imageEl = picture;
  } else {
    const img = mainContent.querySelector('img');
    if (img) imageEl = img;
  }

  // Extract heading (first h1, h2, h3, etc)
  let headingEl = null;
  for (let i = 1; i <= 6; i++) {
    const h = mainContent.querySelector('h' + i);
    if (h) {
      headingEl = h;
      break;
    }
  }

  // Extract subheading and paragraph(s)
  // In this HTML, there is an empty <p> after the h1, and the preceding <p> contains only the picture
  // We'll safely collect only non-empty <p> elements (except the one wrapping the picture)
  let textContent = [];
  if (headingEl) textContent.push(headingEl);
  const paragraphs = mainContent.querySelectorAll('p');
  for (const p of paragraphs) {
    // Skip <p> containing only picture or empty
    const childImgs = p.querySelectorAll('img, picture');
    if (childImgs.length > 0 && p.textContent.trim() === '') continue;
    if (p.textContent.trim() === '') continue;
    // Do not duplicate the heading
    if (headingEl && p.contains(headingEl)) continue;
    textContent.push(p);
  }
  // If nothing but heading, still add heading
  if (textContent.length === 0 && headingEl) textContent.push(headingEl);

  // Prepare table structure
  const cells = [
    ['Hero'], // header row
    [imageEl ? imageEl : ''], // row 2: image if present
    [textContent.length > 0 ? textContent : ''] // row 3: headline and any subtext
  ];

  // Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
