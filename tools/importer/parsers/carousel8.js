/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all carousel items in the block
  function getCarouselItems(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    // Only direct children with cmp-carousel__item
    return Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  // Helper to extract the image element from a carousel item
  function getImageElement(carouselItem) {
    // Look for .image .cmp-image > img
    const imageWrapper = carouselItem.querySelector('.image');
    if (!imageWrapper) return null;
    // Find the first <img> inside
    const img = imageWrapper.querySelector('img');
    return img || null;
  }

  // Helper to extract text content (if any) from a carousel item
  function getTextContent(carouselItem) {
    // Look for any element that is not the image wrapper
    const nodes = Array.from(carouselItem.children).filter((n) => {
      if (n.classList && n.classList.contains('image')) return false;
      return true;
    });
    if (nodes.length === 0) return null;
    // If there are text nodes, wrap them in a div
    const wrapper = document.createElement('div');
    nodes.forEach((n) => wrapper.appendChild(n.cloneNode(true)));
    return wrapper;
  }

  // Find the main carousel container (may be the element itself or a child)
  let carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot && element.classList.contains('cmp-carousel')) {
    carouselRoot = element;
  }
  if (!carouselRoot) return;

  // Get all carousel items
  const items = getCarouselItems(carouselRoot);
  if (!items.length) return;

  // Build the table rows
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  items.forEach((item) => {
    const img = getImageElement(item);
    if (!img) return;
    const textContent = getTextContent(item);
    // Always push two columns: image and text (empty if none)
    rows.push([img, textContent ? textContent : '']);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
