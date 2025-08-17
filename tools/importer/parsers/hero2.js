/* global WebImporter */
export default function parse(element, { document }) {
  // The block name header row
  const headerRow = ['Hero'];

  // Drill to the main hero content: find the innermost div with the actual content
  let heroContent = element;
  while (
    heroContent &&
    heroContent.children.length === 1 &&
    heroContent.firstElementChild.tagName === 'DIV'
  ) {
    heroContent = heroContent.firstElementChild;
  }

  // Find the image (prefer <picture> containing <img>, else <img>)
  let imageCell = null;
  const imgEl = heroContent.querySelector('img');
  if (imgEl) {
    const pictureEl = imgEl.closest('picture');
    imageCell = pictureEl || imgEl;
  }

  // The third row must contain ALL the text content except the picture:
  // - Heading (h1-h6), subheading (h2-h6), rich text (p, a, etc.)

  // Gather heading (if any)
  const headings = Array.from(heroContent.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  // Gather all paragraphs that are not empty and do NOT contain the image (to avoid duplicate)
  const paragraphs = Array.from(heroContent.querySelectorAll('p')).filter(p => {
    // skip if empty or only whitespace
    if (!p.textContent.trim()) return false;
    // skip if it contains the imageCell (already in image row)
    if (imageCell && p.contains(imageCell)) return false;
    return true;
  });

  // Build the third row content array, maintain document order
  // Get all direct children of the content div, and include each relevant heading or paragraph in order
  const textCellContent = [];
  Array.from(heroContent.children).forEach(child => {
    if (/^h[1-6]$/i.test(child.tagName)) {
      textCellContent.push(child);
    } else if (child.tagName === 'P' && child.textContent.trim()) {
      // Exclude <p> containing the image
      if (!(imageCell && child.contains(imageCell))) {
        textCellContent.push(child);
      }
    } else if (child.tagName !== 'DIV' && child.textContent.trim()) {
      // Include non-div, non-heading, non-empty elements (edge case for future variants)
      textCellContent.push(child);
    }
  });
  // If textCellContent is empty, but headings or paragraphs exist (e.g., if they're nested deeper), add them
  if (textCellContent.length === 0) {
    textCellContent.push(...headings, ...paragraphs);
  }

  // Ensure at least an empty cell for the text row (never undefined)
  const textRow = textCellContent.length > 0 ? [textCellContent.length === 1 ? textCellContent[0] : textCellContent] : [''];

  // Compose the rows for the table: header, image, text
  const rows = [
    headerRow,
    [imageCell],
    textRow
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
