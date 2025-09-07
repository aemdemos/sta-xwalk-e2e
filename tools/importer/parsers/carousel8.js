/* global WebImporter */
export default function parse(element, { document }) {
  function getSlides(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll('.cmp-carousel__item'));
  }

  function getImageElement(slide) {
    const img = slide.querySelector('img');
    return img || null;
  }

  function getTextContent(slide) {
    const imageContainer = slide.querySelector('.image');
    const textNodes = [];
    Array.from(slide.children).forEach(child => {
      if (child !== imageContainer) {
        if (child.textContent && child.textContent.trim()) {
          textNodes.push(child.cloneNode(true));
        }
      }
    });
    if (textNodes.length === 0) return '';
    if (textNodes.length === 1) return textNodes[0];
    const frag = document.createDocumentFragment();
    textNodes.forEach(n => frag.appendChild(n));
    return frag;
  }

  let carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) {
    if (element.classList.contains('cmp-carousel')) {
      carouselRoot = element;
    } else {
      return;
    }
  }

  const cells = [];
  const headerRow = ['Carousel (carousel8)'];
  cells.push(headerRow);

  const slides = getSlides(carouselRoot);
  slides.forEach(slide => {
    const img = getImageElement(slide);
    const textContent = getTextContent(slide);
    // Always push two columns: image, textContent (empty string if none)
    cells.push([img, textContent !== undefined ? textContent : '']);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
