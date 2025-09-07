/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build table rows
  const rows = [];
  // Header row must match block name exactly
  rows.push(['Tabs (tabs11)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Use the main contentfragment/article inside the panel if present
      const cf = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // fallback: use entire panel
        contentCell = panel;
      }
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(blockTable);
}
