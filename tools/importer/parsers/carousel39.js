/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image element from a carousel item
  function getImageFromItem(item) {
    const img = item.querySelector('.cmp-image__image');
    return img;
  }

  // Helper to extract text content from a carousel item (if any)
  function getTextContentFromItem(item) {
    // Try to find any text content inside the item
    // Look for headings, paragraphs, links, etc.
    const textParts = [];
    // Heading
    const heading = item.querySelector('h2, h3, h4, h5, h6');
    if (heading) {
      textParts.push(heading.cloneNode(true));
    }
    // Paragraphs
    const paragraphs = item.querySelectorAll('p');
    paragraphs.forEach(p => {
      textParts.push(p.cloneNode(true));
    });
    // Links
    const links = item.querySelectorAll('a');
    links.forEach(a => {
      textParts.push(a.cloneNode(true));
    });
    // If no structured elements, fallback to any text
    if (textParts.length === 0) {
      const text = item.textContent.trim();
      if (text) textParts.push(document.createTextNode(text));
    }
    // If still empty, return empty string
    if (textParts.length === 0) return '';
    return textParts;
  }

  // Find the carousel content wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel items (slides)
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header row
  const headerRow = ['Carousel (carousel39)'];
  const rows = [headerRow];

  // Build rows for each slide (always 2 columns: image, textContent)
  items.forEach((item) => {
    const img = getImageFromItem(item);
    const textContent = getTextContentFromItem(item);
    // Always push two columns per row, even if textContent is empty string
    rows.push([img, textContent !== '' ? textContent : '']);
  });

  // Ensure all rows (except header) have exactly 2 columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) {
      rows[i].push('');
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
