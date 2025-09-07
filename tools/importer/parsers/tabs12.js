/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block
  const tabs = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabs) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabs.querySelector('.cmp-tabs') || tabs;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build header row
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Defensive: find corresponding panel
    const panel = tabPanels[idx];
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: grab the entire tabpanel content
    // Defensive: if panel has a single child (contentfragment), use it
    let tabContent;
    if (panel.children.length === 1) {
      tabContent = panel.children[0];
    } else {
      // Otherwise, use the whole panel
      tabContent = panel;
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabs.replaceWith(block);
}
