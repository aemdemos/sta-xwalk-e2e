/* global WebImporter */
export default function parse(element, { document }) {
  // The block requires: Header row, image row (background image), text row (headline/subheading/cta)
  // Find the hero block structure. It may have .hero-wrapper > .hero.block > div > div
  let mainContent = element;
  // Drill down if there's a hero-wrapper
  const heroWrapper = element.querySelector(':scope > .hero-wrapper');
  if (heroWrapper) {
    // Look for a .hero.block inside hero-wrapper
    const heroBlock = heroWrapper.querySelector(':scope > .hero.block');
    if (heroBlock) {
      mainContent = heroBlock;
    } else {
      mainContent = heroWrapper;
    }
  }
  // Typically the textual and image content is one level below .hero.block
  let contentDiv;
  // Usually .hero.block > div > div
  const tier1 = mainContent.querySelector(':scope > div');
  if (tier1) {
    // Sometimes one more div layer
    const tier2 = tier1.querySelector(':scope > div');
    if (tier2) {
      contentDiv = tier2;
    } else {
      contentDiv = tier1;
    }
  } else {
    contentDiv = mainContent;
  }
  // 1. Extract background image (picture element)
  let picture = contentDiv.querySelector('picture');
  // 2. Extract headline, subheading, cta
  // Headline (h1/h2/h3), any additional p, links/buttons
  let textNodes = [];
  // Headline (usually h1)
  const heading = contentDiv.querySelector('h1,h2,h3');
  if (heading) {
    textNodes.push(heading);
  }
  // Subheading/paragraph (p) but skip paragraphs that only contain <picture>
  contentDiv.querySelectorAll('p').forEach(p => {
    if (!p.querySelector('picture') && p.textContent.trim()) {
      textNodes.push(p);
    }
  });
  // Any cta links/buttons
  contentDiv.querySelectorAll('a, button').forEach(cta => {
    textNodes.push(cta);
  });
  // Build the table rows
  const rows = [];
  rows.push(['Hero']);
  rows.push([picture ? picture : '']);
  // For text row, if there are multiple elements, put them in an array, otherwise just a single element or blank
  if (textNodes.length === 0) {
    rows.push(['']);
  } else if (textNodes.length === 1) {
    rows.push([textNodes[0]]);
  } else {
    rows.push([textNodes]);
  }
  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
