/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []);

  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row as specified
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, get label and content
  tabLabels.forEach((tabLabel, i) => {
    const label = tabLabel.textContent.trim();
    const panel = tabPanels[i];
    if (!panel) return;

    // Find the .contentfragment inside the panel, or fallback to panel content
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      // Reference the actual contentfragment element (do not clone)
      tabContent = contentFragment;
    } else {
      // Fallback: reference the panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
