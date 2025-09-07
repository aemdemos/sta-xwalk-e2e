/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero/teaser block
  const hero = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  if (!hero) return;

  // Find the image element (background image)
  let imageDiv = hero.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Find the content (title, subtitle, etc)
  let contentDiv = hero.querySelector('.cmp-teaser__content');
  let contentCell = [];
  if (contentDiv) {
    contentCell = Array.from(contentDiv.childNodes).filter(n => {
      return (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim());
    });
  }

  // Build the table rows
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the hero/teaser block with the new table
  hero.replaceWith(table);

  // Remove any <hr> elements that are not inside a Section Metadata table
  Array.from(element.querySelectorAll('hr')).forEach(hr => {
    const parentTable = hr.closest('table');
    if (!parentTable || !parentTable.querySelector('td') || !parentTable.querySelector('td').textContent.includes('Section Metadata')) {
      hr.remove();
    }
  });
}
