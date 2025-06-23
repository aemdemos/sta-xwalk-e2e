/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block inside the section
  const heroBlock = element.querySelector('.hero.block');
  let imgCell = '';
  let textCell = '';

  if (heroBlock) {
    // The hero block's visual/content is within a nested <div><div>
    const innerDiv = heroBlock.querySelector(':scope > div > div');
    if (innerDiv) {
      // Find the <picture> (for image) inside a <p>
      const picturePara = Array.from(innerDiv.querySelectorAll('p')).find(p => p.querySelector('picture'));
      if (picturePara) imgCell = picturePara;
      // Find the first heading (title)
      const heading = innerDiv.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textCell = heading;
    }
  }
  // Ensure empty string if nothing found (for robustness)
  if (!imgCell) imgCell = '';
  if (!textCell) textCell = '';

  const cells = [
    ['Hero (hero2)'], // header row, block name exactly as required
    [imgCell],        // image row (may be empty)
    [textCell],       // text row (may be empty)
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
