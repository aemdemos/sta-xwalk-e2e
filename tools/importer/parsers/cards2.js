/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'Members Only' section title to locate the secure cards block
  const titles = Array.from(element.querySelectorAll('.cmp-title'));
  let membersTitle = null;
  for (const t of titles) {
    const h2 = t.querySelector('h2');
    if (h2 && h2.textContent.trim().toLowerCase() === 'members only') {
      membersTitle = t.closest('.aem-GridColumn');
      break;
    }
  }
  if (!membersTitle) return;

  // Find the grid
  const grid = membersTitle.parentElement;
  const children = Array.from(grid.children);
  const membersIdx = children.indexOf(membersTitle);

  // Find the two teaser cards that follow the 'Members Only' title
  // They have class 'cmp-teaser--secure' and are after the Members Only title
  const teasers = [];
  for (let i = membersIdx + 1; i < children.length; i++) {
    const el = children[i];
    if (el.querySelector && el.querySelector('.cmp-teaser--secure')) {
      teasers.push(el.querySelector('.cmp-teaser'));
    }
    if (teasers.length === 2) break;
  }
  if (teasers.length === 0) return;

  // Build the table rows
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  teasers.forEach(teaser => {
    // Get image (first cell)
    let imageCell = null;
    const imageDiv = teaser.querySelector('.cmp-teaser__image');
    if (imageDiv) {
      imageCell = imageDiv.cloneNode(true);
    }
    // Get text content (second cell)
    const textCellParts = [];
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) textCellParts.push(title.cloneNode(true));
      // Description
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) textCellParts.push(desc.cloneNode(true));
      // CTA (may be a link or just text)
      const action = contentDiv.querySelector('.cmp-teaser__action-container');
      if (action) {
        const link = action.querySelector('a');
        if (link) {
          textCellParts.push(link.cloneNode(true));
        } else if (action.textContent.trim()) {
          const div = document.createElement('div');
          div.textContent = action.textContent.trim();
          textCellParts.push(div);
        }
      }
    }
    rows.push([imageCell, textCellParts]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the Members Only title's column with the table
  membersTitle.replaceWith(table);
  // Remove the teaser columns as they're now included in the table
  teasers.forEach(teaser => {
    const teaserCol = teaser.closest('.aem-GridColumn');
    if (teaserCol && teaserCol.parentElement) {
      teaserCol.remove();
    }
  });
}
