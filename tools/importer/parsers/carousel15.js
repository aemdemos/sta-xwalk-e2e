/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Always use a 2-column table: header row is single cell, data rows are [image, text (empty if none)]
  const headerRow = ['Carousel (carousel15)'];
  const rows = [headerRow];

  // Find all carousels in the block
  const carouselWrappers = Array.from(element.querySelectorAll(':scope > div'));

  carouselWrappers.forEach((carouselWrapper) => {
    const carouselContent = carouselWrapper.querySelector('.cmp-carousel__content');
    if (!carouselContent) return;
    const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));
    items.forEach((item) => {
      let imgEl = item.querySelector('.cmp-image__image');
      if (!imgEl) imgEl = item.querySelector('img');
      let textContent = '';
      // Try to find text content in the slide (e.g., heading, description, cta)
      // Look for any direct children after the image container
      const imageContainer = item.querySelector('.image');
      if (imageContainer) {
        // Collect all siblings after the image container
        let sibling = imageContainer.nextElementSibling;
        const textEls = [];
        while (sibling) {
          textEls.push(sibling.cloneNode(true));
          sibling = sibling.nextElementSibling;
        }
        if (textEls.length > 0) {
          // Wrap in a div to preserve structure
          const wrapper = document.createElement('div');
          textEls.forEach(el => wrapper.appendChild(el));
          textContent = wrapper;
        }
      } else {
        // If no image container, try to find any text nodes or elements except the image
        const children = Array.from(item.children).filter(child => !child.matches('.image'));
        if (children.length > 0) {
          const wrapper = document.createElement('div');
          children.forEach(el => wrapper.appendChild(el.cloneNode(true)));
          textContent = wrapper;
        }
      }
      // Always push two columns: image and text (empty if none)
      rows.push([imgEl, textContent || '']);
    });
  });

  // Ensure all rows after the header have exactly two columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) rows[i].push('');
    if (rows[i].length > 2) rows[i] = rows[i].slice(0, 2);
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
