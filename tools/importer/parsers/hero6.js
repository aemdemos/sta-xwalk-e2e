/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero/teaser block
  const hero = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  if (!hero) return;

  // Find the image container (background image)
  let imageDiv = hero.querySelector('.cmp-teaser__image');
  let imgEl = null;
  if (imageDiv) {
    imgEl = imageDiv.querySelector('img');
  }

  // Find the content container (title, subtitle, CTA)
  let contentDiv = hero.querySelector('.cmp-teaser__content');
  // Defensive: fallback if not found
  if (!contentDiv) {
    contentDiv = hero.querySelector('h1, h2, h3, h4, h5, h6, p');
  }

  // Build the table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [contentDiv ? contentDiv : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Remove any <hr> that is not inside a Section Metadata table
  element.querySelectorAll('hr').forEach(hr => {
    const table = hr.closest('table');
    if (!table || !table.querySelector('tr > td') || table.querySelector('tr > td').textContent.trim() !== 'Section Metadata') {
      hr.remove();
    }
  });

  // Replace the hero/teaser block with the table
  hero.replaceWith(table);
}
