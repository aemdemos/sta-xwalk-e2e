/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block (should be the root of this parse)
  const tabsRoot = element;
  if (!tabsRoot) return;

  // Header row for the block table
  const headerRow = ['Tabs (tabs3)'];

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if labels and panels match
  const tabRows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // For robustness, reference the entire tabpanel content
    tabRows.push([
      label,
      panel
    ]);
  }

  // Compose the cells array for the block table
  const cells = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  tabsRoot.replaceWith(block);
}
