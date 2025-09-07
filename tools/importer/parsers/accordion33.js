/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!cf) return;

  // Find the content elements container
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Always use the required header row
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Get all direct children of cfElements
  const children = Array.from(cfElements.children);

  // Iterate and group content between <h2> as accordion items
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.tagName === 'H2') {
      const title = node.cloneNode(true);
      // Gather all following siblings until the next <h2> or end
      const contentNodes = [];
      let j = i + 1;
      while (j < children.length && children[j].tagName !== 'H2') {
        const c = children[j];
        // If it's a div with aem-Grid, skip if empty
        if (
          c.tagName === 'DIV' &&
          c.classList.contains('aem-Grid') &&
          c.children.length === 0
        ) {
          j++;
          continue;
        }
        // If it's a div with aem-Grid, but has children, flatten its children
        if (
          c.tagName === 'DIV' &&
          c.classList.contains('aem-Grid') &&
          c.children.length > 0
        ) {
          contentNodes.push(...Array.from(c.children).map(n => n.cloneNode(true)));
        } else {
          contentNodes.push(c.cloneNode(true));
        }
        j++;
      }
      // Defensive: If contentNodes is empty, skip this accordion item
      if (contentNodes.length === 0) {
        i = j;
        continue;
      }
      // Add the row: [title, content]
      rows.push([
        title,
        contentNodes.length === 1 ? contentNodes[0] : contentNodes
      ]);
      i = j;
    } else {
      i++;
    }
  }

  // Only create the block if we have at least one accordion item
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the contentfragment's parent (the <article.contentfragment>) with the block table
    cf.replaceWith(table);
  }
}
