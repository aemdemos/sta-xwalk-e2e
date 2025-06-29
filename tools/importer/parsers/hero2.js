/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block (should only be one)
  const heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) return;
  // The hero block's structure is: .hero.block > div > div > ...
  const outerDiv = heroBlock.querySelector(':scope > div');
  if (!outerDiv) return;
  const contentDiv = outerDiv.querySelector(':scope > div');
  if (!contentDiv) return;

  // Children: <p> (picture), <h1> (title), <p> (optional subheading, cta, etc)
  const children = Array.from(contentDiv.children);

  // Find the first <picture> element within a <p>
  let imageEl = null;
  if (children.length > 0 && children[0].tagName.toLowerCase() === 'p') {
    const pic = children[0].querySelector('picture');
    if (pic) imageEl = pic;
  }

  // Gather all text-related nodes (all after the picture)
  const textEls = [];
  for (let i = 1; i < children.length; i++) {
    const node = children[i];
    // Only include if not empty (avoid empty <p>)
    if (node.textContent.trim() !== '' || node.tagName.toLowerCase().startsWith('h')) {
      textEls.push(node);
    }
  }

  // Compose rows for the table
  const headerRow = ['Hero'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textEls.length === 1 ? textEls[0] : textEls.length > 1 ? textEls : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
