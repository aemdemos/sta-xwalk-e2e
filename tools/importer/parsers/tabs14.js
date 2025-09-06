/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements inside the tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: If mismatch in tab count, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as required
  rows.push(['Tabs (tabs14)']);

  // For each tab, add a row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // For content, grab all direct children of the tabpanel
    // Usually a single .contentfragment, but could be more
    const contentNodes = Array.from(panel.childNodes).filter(
      node => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
    );
    // If only one element, use it directly, else use array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }
    rows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
