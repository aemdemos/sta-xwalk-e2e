/* global WebImporter */
export default function parse(element, { document }) {
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image element
    const imgEl = item.querySelector('img');
    if (!imgEl) return;

    // Find text content (if any) that is not part of the image
    let textCellContent = '';
    const imageContainer = imgEl.closest('.image');
    if (imageContainer) {
      let next = imageContainer.nextElementSibling;
      const textNodes = [];
      while (next) {
        if (next.textContent.trim() || next.children.length > 0) {
          textNodes.push(next.cloneNode(true));
        }
        next = next.nextElementSibling;
      }
      if (textNodes.length > 0) {
        if (textNodes.length === 1) {
          textCellContent = textNodes[0];
        } else {
          const wrapper = document.createElement('div');
          textNodes.forEach(n => wrapper.appendChild(n));
          textCellContent = wrapper;
        }
      }
    }
    // Only push second cell if there is text content
    if (textCellContent) {
      rows.push([imgEl, textCellContent]);
    } else {
      rows.push([imgEl]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
