/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tab block root)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements inside the tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels (divs with role="tabpanel" and class cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Header row as per spec
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // Find the main content inside the tabpanel
    // Usually it's the first child (e.g., .contentfragment or similar)
    let contentElem = null;
    // Prefer the first element child (skip text nodes)
    for (const child of panel.children) {
      if (child.nodeType === 1) {
        contentElem = child;
        break;
      }
    }
    // Fallback to panel itself if no child
    if (!contentElem) contentElem = panel;

    rows.push([label, contentElem]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsRoot with the block table
  tabsRoot.replaceWith(block);
}
