/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find all h2 titles (skatepark sections)
  const h2s = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
  if (!h2s.length) return;

  const headerRow = ['Cards (cards38)'];
  const rows = [headerRow];

  h2s.forEach((h2) => {
    // Find the closest .cmp-title ancestor
    const titleDiv = h2.closest('.cmp-title');
    // Find the parent .aem-GridColumn of the title
    const gridColumn = titleDiv.closest('.aem-GridColumn');
    // The parent .aem-Grid is the section container
    const grid = gridColumn && gridColumn.parentElement;
    // Find the image in the same section (after the title)
    let image = null;
    let foundTitle = false;
    if (grid) {
      for (const child of grid.children) {
        if (child === gridColumn) {
          foundTitle = true;
          continue;
        }
        if (foundTitle && child.querySelector && child.querySelector('.cmp-image')) {
          image = child.querySelector('.cmp-image');
          break;
        }
      }
    }
    // If no image found, skip this card
    if (!image) return;

    // Find the section's descriptive paragraphs and address
    // We'll look for the next <p> and <i><b>...</b></i> after the title
    let contentParas = [];
    let address = null;
    let reachedSection = false;
    let parent = grid.parentElement;
    // Find the index of the grid in its parent
    const grids = Array.from(parent.children);
    const gridIdx = grids.indexOf(grid);
    // Search forward for <p> and <i><b>...</b></i> until next .aem-Grid (next section)
    for (let i = gridIdx + 1; i < grids.length; i++) {
      const node = grids[i];
      // Stop if we hit another .aem-Grid with a .cmp-title--underline (next section)
      if (node.querySelector && node.querySelector('.cmp-title--underline')) break;
      // Collect <p> tags
      const ps = node.querySelectorAll ? node.querySelectorAll('p') : [];
      ps.forEach(p => {
        // If this <p> contains <i><b>...</b></i>, treat as address
        if (p.querySelector('i > b')) {
          if (!address) address = p;
        } else {
          contentParas.push(p);
        }
      });
    }

    // Compose the cell content
    const cellContent = [];
    // Title (h2)
    cellContent.push(h2.cloneNode(true));
    // Description paragraphs
    contentParas.forEach(p => cellContent.push(p.cloneNode(true)));
    // Address
    if (address) cellContent.push(address.cloneNode(true));

    rows.push([
      image.cloneNode(true),
      cellContent
    ]);
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
