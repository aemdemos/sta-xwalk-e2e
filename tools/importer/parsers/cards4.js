/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cards block (the <ul> inside)
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children);

  // Table header
  const headerRow = ['Cards'];
  const rows = [headerRow];

  // For each <li> = card
  cards.forEach((li) => {
    // Get image/icon (first cell)
    const imgContainer = li.querySelector('.cards-card-image');
    let image = null;
    if (imgContainer) {
      const pic = imgContainer.querySelector('picture');
      if (pic) {
        image = pic;
      } else {
        const img = imgContainer.querySelector('img');
        if (img) image = img;
      }
    }

    // Get rich text (second cell)
    const bodyContainer = li.querySelector('.cards-card-body');
    let textContent = null;
    if (bodyContainer) {
      // Use the actual bodyContainer, move its children directly to preserve formatting
      textContent = document.createElement('div');
      while (bodyContainer.firstChild) {
        textContent.appendChild(bodyContainer.firstChild);
      }
    }
    // If bodyContainer was missing, ensure we don't lose the row
    rows.push([
      image,
      textContent
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
