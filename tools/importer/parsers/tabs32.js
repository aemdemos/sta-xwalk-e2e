/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element;
  if (!tabsRoot) return;

  // Find tab labels (li elements)
  const tabLabels = Array.from(tabsRoot.querySelectorAll('ol[role="tablist"] > li'));
  // Find tab panels (div[role="tabpanel"])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs32)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: get the corresponding panel
    const panel = tabPanels[i];
    if (!panel) continue;

    // For content, reference the entire panel's content
    // Find the main contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment, article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element
  tabsRoot.replaceWith(block);
}
