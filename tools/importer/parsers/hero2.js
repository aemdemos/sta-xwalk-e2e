/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the hero image and heading
  // The structure is: element > .hero-wrapper > .hero.block > div > div > [p (picture), h1, p]
  let imageEl = null;
  let headingEl = null;
  // Find the hero-wrapper
  const heroWrapper = element.querySelector('.hero-wrapper');
  if (!heroWrapper) return;
  // Find the .hero.block
  const heroBlock = heroWrapper.querySelector('.hero.block');
  if (!heroBlock) return;
  // Find the inner content divs
  const contentDivs = heroBlock.querySelectorAll(':scope > div > div');
  // Defensive: fallback to heroBlock's first child if structure changes
  let contentDiv = contentDivs.length ? contentDivs[0] : heroBlock;
  // Find the <picture> or <img> inside a <p>
  imageEl = contentDiv.querySelector('picture') || contentDiv.querySelector('img');
  // Find the <h1>
  headingEl = contentDiv.querySelector('h1');

  // Build table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Compose content row: heading and any other elements (subheading, CTA, etc)
  const contentItems = [];
  if (headingEl) contentItems.push(headingEl);
  // Optionally, add subheading or CTA if present (not in this example)
  // For future-proofing, add any <h2>, <h3>, <p> (excluding the image <p>)
  contentDiv.childNodes.forEach((node) => {
    if (
      node !== headingEl &&
      node.nodeType === 1 &&
      (node.tagName === 'H2' || node.tagName === 'H3' || node.tagName === 'P')
    ) {
      // Exclude the <p> that contains the image
      if (!node.querySelector('picture') && !node.querySelector('img')) {
        contentItems.push(node);
      }
    }
  });
  const contentRow = [contentItems.length ? contentItems : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
