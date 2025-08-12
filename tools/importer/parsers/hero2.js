/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .hero.block inside wrappers
  const heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) return;

  // Find the main hero content div
  const contentWrapper = heroBlock.querySelector('div > div');
  if (!contentWrapper) return;

  // Find the first <picture> or <img> for the background image (optional)
  let imageElem = null;
  let imgOrPicture = null;
  // Look for <picture> containing <img>
  const picture = contentWrapper.querySelector('picture');
  if (picture && picture.querySelector('img')) {
    imgOrPicture = picture;
    imageElem = picture;
  } else {
    // Or just an <img>
    const img = contentWrapper.querySelector('img');
    if (img) {
      imgOrPicture = img;
      imageElem = img;
    }
  }

  // For the text cell, collect everything except the image
  // Reference existing child nodes, skipping the image/picture node
  const textNodes = [];
  Array.from(contentWrapper.childNodes).forEach(node => {
    // If node is picture/img, skip
    if (node === imgOrPicture) return;
    // If empty <p>, skip
    if (node.nodeType === 1 && node.tagName === 'P' && node.textContent.trim() === '') return;
    // Only add non-empty text nodes and elements
    if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim().length)) {
      textNodes.push(node);
    }
  });

  // Build table rows for block
  const rows = [
    ['Hero'],
    [imageElem ? imageElem : ''],
    [textNodes.length ? textNodes : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
