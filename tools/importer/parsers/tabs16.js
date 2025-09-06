/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs16)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel) => {
    // Match tab label to panel by aria-controls
    const controlsId = tabLabel.getAttribute('aria-controls');
    const panel = tabPanels.find(p => p.id === controlsId);
    if (!panel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: reference the actual DOM node (not clone)
    // Find the main content node inside the panel
    let tabContent = null;
    // Prefer .contentfragment or article or .cmp-contentfragment
    tabContent = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (!tabContent) {
      // Fallback: wrap all panel children in a div
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => tabContent.appendChild(node));
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
