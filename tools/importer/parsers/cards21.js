/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image list container
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Get all card items
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    // Defensive: find the article content
    const article = item.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: find the image element
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the actual <img> inside the image link
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text cell: title, description, and CTA
    const textContent = [];
    // Title
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Wrap title in <strong> for heading style
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textContent.push(strong);
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Use a <p> for description
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textContent.push(p);
    }
    // CTA: use title link if present
    if (titleLink && titleLink.href) {
      // Only add CTA if the link is not already used for the title
      // (in this structure, the title is always a link, so skip duplicate)
    }

    // Add row: [image, text]
    rows.push([imageCell, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
