/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the actual tabs container (could be .cmp-tabs)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: match labels to panels
  if (tabLabels.length !== tabPanels.length) {
    // If mismatch, bail out
    return;
  }

  // Build table rows
  const headerRow = ['Tabs (tabs29)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: find the main content fragment inside each panel
    let tabContent = null;
    // Prefer the article.cmp-contentfragment inside panel
    tabContent = panel.querySelector('article.cmp-contentfragment') || panel;

    // Place label and content in row
    rows.push([
      label,
      tabContent
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
