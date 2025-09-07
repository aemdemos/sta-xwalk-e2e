/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll(':scope > ol.cmp-tabs__tablist > li')
  );
  if (!tabLabels.length) return;

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll(':scope > div[role="tabpanel"]')
  );
  if (!tabPanels.length) return;

  // Build rows: header, then each tab (label, content)
  const rows = [];
  // Header row as per guidelines
  rows.push(['Tabs (tabs29)']);

  // For each tab, get label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Defensive: find the matching tabpanel
    const panel = tabPanels[i];
    if (!panel) continue;

    // For content, grab the entire tabpanel's content (excluding the tabpanel wrapper)
    // Usually, the first child is a .contentfragment
    let content = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: use all children
      content = Array.from(panel.childNodes);
    }

    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
