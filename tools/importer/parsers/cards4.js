/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');

  // Prepare the table rows
  const rows = [];
  // We'll add a placeholder for the header so we can span columns
  // Build card rows first to determine the column count
  const cardRows = [];
  lis.forEach((li) => {
    // Image/Icon cell
    let imgCell = '';
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imgCell = img;
      }
    }
    // Text content cell
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      const children = Array.from(bodyDiv.childNodes).filter((node) => {
        return node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      });
      if (children.length === 1) {
        textCell = children[0];
      } else if (children.length > 1) {
        textCell = children;
      } else {
        textCell = '';
      }
    }
    cardRows.push([imgCell, textCell]);
  });

  // Header row: single cell with colspan, followed by the rest of the rows
  // We'll use a dummy cell so that createTable makes a 2-col table, then set colspan on the th later
  rows.push(['Cards', '']);
  rows.push(...cardRows);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Set colspan=2 on the header cell and remove the now unnecessary second header cell
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length > 1) {
    headerRow.children[0].setAttribute('colspan', '2');
    headerRow.removeChild(headerRow.children[1]);
  }

  element.replaceWith(table);
}
