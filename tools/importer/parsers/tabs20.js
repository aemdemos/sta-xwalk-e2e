/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header
  const headerRow = ['Tabs (tabs20)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Defensive: get panel
    const panel = tabPanels[idx];
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: reference the whole panel content
    // Find the main content fragment/article inside the panel
    let tabContent = null;
    // Prefer the article/contentfragment inside panel
    tabContent = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment') || panel;

    // Defensive: if tabContent is empty, fallback to panel
    if (!tabContent || tabContent.childNodes.length === 0) tabContent = panel;

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
