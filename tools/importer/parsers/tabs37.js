/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tab container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: Find the main content inside the tab panel
    // Usually a contentfragment/article, but fallback to panel itself
    let content = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;

    // For robustness, reference the content block directly
    rows.push([
      label,
      content
    ]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(blockTable);
}
