/* global WebImporter */
export default function parse(element, { document }) {
  function getSlides(carouselEl) {
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  function getImage(slide) {
    const imageWrapper = slide.querySelector('.image');
    if (!imageWrapper) return null;
    const cmpImage = imageWrapper.querySelector('[data-cmp-is="image"]');
    if (!cmpImage) return null;
    const img = cmpImage.querySelector('img');
    return img || null;
  }

  function getTextContent(slide) {
    // Try to find heading and description inside the slide
    // Look for headings (h1-h6), paragraphs, and links
    const fragments = [];
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) fragments.push(heading.cloneNode(true));
    const paragraphs = slide.querySelectorAll('p');
    paragraphs.forEach(p => fragments.push(p.cloneNode(true)));
    const links = slide.querySelectorAll('a');
    links.forEach(link => {
      if (!Array.from(paragraphs).some(p => p.contains(link))) {
        fragments.push(link.cloneNode(true));
      }
    });
    if (fragments.length === 0) return '';
    return fragments.length === 1 ? fragments[0] : fragments;
  }

  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const headerRow = ['Carousel (carousel9)'];
  const rows = [headerRow];

  const slides = getSlides(carousel);
  slides.forEach((slide) => {
    const img = getImage(slide);
    const textContent = getTextContent(slide);
    // Always push two columns: image, and text (empty string if none)
    rows.push([img, textContent !== undefined && textContent !== null ? textContent : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
