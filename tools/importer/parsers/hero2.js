/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the hero block
  const heroBlock = element.querySelector('.hero.block');
  if (!heroBlock) return;

  // Find the deepest content wrapper (usually heroBlock > div > div)
  let contentContainer = heroBlock;
  const innerDivs = heroBlock.querySelectorAll(':scope > div');
  if (innerDivs.length === 1) {
    contentContainer = innerDivs[0];
    const deeperDivs = contentContainer.querySelectorAll(':scope > div');
    if (deeperDivs.length === 1) {
      contentContainer = deeperDivs[0];
    }
  }

  // Background image: find <p><picture> (reference the <p> for best compatibility)
  let imageCell = '';
  const pWithPicture = contentContainer.querySelector('p picture');
  if (pWithPicture) {
    const pictureParent = pWithPicture.closest('p');
    if (pictureParent) {
      imageCell = pictureParent;
    } else {
      imageCell = pWithPicture;
    }
  }

  // Title (Heading)
  let textCellContent = [];
  const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    textCellContent.push(heading);
  }

  // (Optional) Subheading or CTA: look for paragraphs after heading
  // Example HTML only has an empty <p></p>, so we skip unless it contains text or link
  const possibleParagraphs = Array.from(contentContainer.querySelectorAll('p'));
  // Only include non-empty paragraphs that are NOT the picture parent
  possibleParagraphs.forEach(p => {
    if (p === imageCell) return;
    if (p.textContent.trim() || p.querySelector('a')) {
      textCellContent.push(p);
    }
  });

  // If no text found, cell should still exist
  const textCell = textCellContent.length ? textCellContent : '';

  // Build table rows per spec: header, image, text content
  const rows = [
    ['Hero (hero2)'],
    [imageCell],
    [textCell]
  ];

  // Create and replace with the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
