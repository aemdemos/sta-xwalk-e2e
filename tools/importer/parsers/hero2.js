/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block (could be .hero.block or fallback to element)
  let heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) heroBlock = element;

  // Find the innermost container with the actual content (usually a div inside the hero block)
  let contentContainer = heroBlock;
  const innerDiv = heroBlock.querySelector('div');
  if (innerDiv && innerDiv !== heroBlock) {
    contentContainer = innerDiv;
    // Sometimes, there's another inner div
    const nestedDiv = innerDiv.querySelector('div');
    if (nestedDiv && nestedDiv !== innerDiv) {
      contentContainer = nestedDiv;
    }
  }

  // Find the first <picture> (background image)
  let backgroundImg = null;
  const pictureP = Array.from(contentContainer.querySelectorAll('p')).find(p => p.querySelector('picture'));
  if (pictureP) {
    backgroundImg = pictureP.querySelector('picture');
  }

  // Find the first heading (h1-h6) for title
  let title = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');

  // Collect subheading (not present in this example, but could be h2/h3 or a paragraph after the title)
  // Also collect CTA, which would be a link, if present
  // For this case, just grab all content after the image and before/after the heading as the 'text' cell

  // Collect all children after the picture (excluding the picture) for the text cell
  const cellsAfterPicture = [];
  let foundPicture = false;
  for (const child of contentContainer.children) {
    if (child.querySelector && child.querySelector('picture')) {
      foundPicture = true;
      continue;
    }
    if (foundPicture && (child.tagName !== 'PICTURE' && child.textContent.trim() !== '')) {
      // Make sure not to add empty <p>s
      if (!(child.tagName === 'P' && child.textContent.trim() === '')) {
        cellsAfterPicture.push(child);
      }
    }
  }

  // If we can't find cells this way, fallback to all children except picture
  let textContentArr = [];
  if (cellsAfterPicture.length) {
    textContentArr = cellsAfterPicture;
  } else {
    // Use all children except the picture
    textContentArr = Array.from(contentContainer.children).filter(child => !child.querySelector('picture'));
  }

  // Strip empty <p> from textContentArr
  textContentArr = textContentArr.filter(el => !(el.tagName === 'P' && el.textContent.trim() === ''));

  // If nothing left, but we found a title, use it
  if (!textContentArr.length && title) {
    textContentArr = [title];
  }

  // For this example: single heading after the picture
  // Compose table rows
  const rows = [
    ['Hero (hero2)'],
    [backgroundImg ? backgroundImg : ''],
    [textContentArr.length === 1 ? textContentArr[0] : textContentArr]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
