/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment block that contains the surf spots and images
  const cf = element.querySelector('article.contentfragment');
  if (!cf) return;

  // Find the .cmp-contentfragment__elements (the main content container)
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll collect slides as [image, text] pairs
  const slides = [];

  // Get all children of cfElements
  const children = Array.from(cfElements.children);

  let i = 0;
  while (i < children.length) {
    const node = children[i];
    // Look for h2 (spot name)
    if (node.tagName === 'H2') {
      // Look ahead for image and description
      let image = null;
      let desc = null;
      let j = i + 1;
      // Find image and description in following siblings until next h2 or end
      while (j < children.length) {
        const sib = children[j];
        if (!image && sib.querySelector && sib.querySelector('.cmp-image')) {
          image = sib.querySelector('.cmp-image');
        }
        if (!desc && sib.tagName === 'P') {
          desc = sib;
        }
        // Stop if next h2
        if (sib.tagName === 'H2') break;
        j++;
      }
      // Only add slide if image is found
      if (image) {
        // Compose the text cell: heading + desc (if present)
        let row;
        if (desc) {
          row = [image.cloneNode(true), [node.cloneNode(true), desc.cloneNode(true)]];
        } else {
          row = [image.cloneNode(true)];
        }
        slides.push(row);
      }
    }
    i++;
  }

  // If no slides found, try to find any images and text pairs in the cfElements
  if (!slides.length) {
    // Fallback: find all .cmp-image in cfElements and pair with next P or H2
    const images = Array.from(cfElements.querySelectorAll('.cmp-image'));
    images.forEach(img => {
      // Find the closest following H2 or P
      let textCell = [];
      let next = img.parentElement.nextElementSibling;
      while (next) {
        if (next.tagName === 'H2' || next.tagName === 'P') {
          textCell.push(next.cloneNode(true));
          break;
        }
        next = next.nextElementSibling;
      }
      if (textCell.length) {
        slides.push([img.cloneNode(true), textCell]);
      } else {
        slides.push([img.cloneNode(true)]);
      }
    });
  }

  // If still no slides, do nothing
  if (!slides.length) return;

  // Build the table rows
  const headerRow = ['Carousel (carousel15)'];
  const tableRows = [headerRow, ...slides];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the cf (entire contentfragment) with the block
  cf.replaceWith(block);
}
