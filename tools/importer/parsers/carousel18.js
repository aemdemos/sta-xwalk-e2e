/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text content for each slide
  function extractSlideContent(item) {
    // Extract image
    let imgEl = item.querySelector('.cmp-image__image');
    if (!imgEl) {
      imgEl = item.querySelector('img');
    }

    // Extract text content (title, description, CTA)
    let textContent = '';
    // Try to find a heading (h2, h3, etc.) inside the slide
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textContent += `<h3>${heading.textContent.trim()}</h3>`;
    }
    // Find paragraphs or other text nodes
    const paragraphs = item.querySelectorAll('p');
    paragraphs.forEach(p => {
      textContent += `<p>${p.textContent.trim()}</p>`;
    });
    // Find links (CTA)
    const links = item.querySelectorAll('a');
    links.forEach(a => {
      textContent += `<p><a href="${a.href}">${a.textContent.trim()}</a></p>`;
    });

    // If no structured text found, try to get any text
    if (!textContent) {
      // Get all text except alt/title from image
      const textNodes = Array.from(item.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      textNodes.forEach(n => {
        textContent += `<p>${n.textContent.trim()}</p>`;
      });
    }

    // Always return two columns per row, second column empty if no text
    return [imgEl ? imgEl : '', textContent || ''];
  }

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slide items
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Build table rows
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  items.forEach((item) => {
    rows.push(extractSlideContent(item));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
