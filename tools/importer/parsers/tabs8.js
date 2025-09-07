/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Prepare header row
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  // For each tab, collect label and content
  tabLabels.forEach((tabLabel, idx) => {
    // Defensive: Find corresponding panel
    const panel = tabPanels[idx];
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: find the main contentfragment inside the panel
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the entire contentfragment as the tab content (reference, not clone)
      tabContent = contentFragment;
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.children);
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
