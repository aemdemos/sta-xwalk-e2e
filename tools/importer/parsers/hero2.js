/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero.block div
  const heroBlock = element.querySelector('.hero.block');

  let imgEl = null;
  let headingEl = null;

  if (heroBlock) {
    // Find img (inside <picture> inside <p>)
    const pictureP = heroBlock.querySelector('picture')?.closest('p');
    if (pictureP) {
      const picture = pictureP.querySelector('picture');
      if (picture) {
        imgEl = pictureP;
      }
    }
    // Find heading (prefer h1, fallback to h2, etc)
    headingEl = heroBlock.querySelector('h1, h2, h3, h4, h5, h6');
    // Also handle possibility of empty <p> lines (for spacing)
  }

  // Compose the rows as per the example markdown: Header, image, heading
  const rows = [
    ['Hero'],
    [imgEl ? imgEl : ''],
    [headingEl ? headingEl : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
