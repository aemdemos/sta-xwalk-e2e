/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build rows: header first, then each tab label/content
  const rows = [];
  // Header row as specified
  rows.push(['Tabs (tabs19)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if missing
    if (!label || !panel) continue;
    // Use the entire tabpanel content for resilience
    rows.push([
      label,
      panel
    ]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new block
  tabsBlock.replaceWith(block);
}
