/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  // Prepare header row as in markdown example
  const headerRow = ['Cards'];
  const rows = [headerRow];

  lis.forEach(li => {
    // First cell: .cards-card-image > picture (image, required)
    // Second cell: .cards-card-body (rich text, required)
    let imageCell = '';
    let textCell = '';

    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      }
    }
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
