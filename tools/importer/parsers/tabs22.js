/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tabs container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: first row is header
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: get corresponding panel
    const panel = tabPanels[i];
    let labelText = tabLabel.textContent.trim();
    // Defensive: fallback if no panel
    let contentCell;
    if (panel) {
      // Use the entire panel content (preserves structure, images, etc.)
      // Find the contentfragment inside panel (if present)
      const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // If not, use panel itself
        contentCell = panel;
      }
    } else {
      contentCell = document.createTextNode('');
    }
    rows.push([labelText, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
