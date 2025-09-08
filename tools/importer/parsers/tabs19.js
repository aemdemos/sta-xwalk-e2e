/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only process if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows: header first
  const rows = [];
  const headerRow = ['Tabs (tabs19)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Defensive: find the main content inside the tabpanel
    // Usually a .contentfragment or similar
    let contentElem = null;
    // Try to find a direct content block
    contentElem = panel.querySelector('.contentfragment, article, div');
    // Fallback to the panel itself if nothing found
    if (!contentElem) contentElem = panel;

    rows.push([label, contentElem]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
