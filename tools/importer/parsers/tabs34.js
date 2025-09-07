/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header row as specified
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];

  // For each tab, add a row: [Label, Content]
  tabLabels.forEach((labelEl, idx) => {
    // Get tab label text
    const labelText = labelEl.textContent.trim();
    // Get tab panel content
    const panelEl = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panelEl) return;

    // The content for the tab is the entire tabpanel div (reference, not clone)
    rows.push([labelText, panelEl]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
