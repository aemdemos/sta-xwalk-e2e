/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row: block name per spec
  rows.push(['Tabs (tabs36)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Find the main content inside the panel
    // Usually a .contentfragment or similar
    let content = null;
    // Prefer the first non-script/style/meta element child
    for (const child of panel.children) {
      if (child.nodeType === 1 && !['SCRIPT','STYLE','META'].includes(child.tagName)) {
        content = child;
        break;
      }
    }
    // Fallback: use the panel itself if nothing else
    if (!content) content = panel;
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
