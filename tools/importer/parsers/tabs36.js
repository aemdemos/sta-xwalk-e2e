/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root element
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels (li elements inside the tablist)
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get all tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build the table rows
  const rows = [];
  // Header row: block name only
  rows.push(['Tabs (tabs36)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: find the corresponding panel (by order)
    const panel = tabPanels[i];
    if (!panel) continue;

    // For tab content, grab everything inside the tabpanel
    // We'll use the entire content of the tabpanel for resilience
    const tabContent = Array.from(panel.childNodes).filter(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
    );

    // If only one element, use it directly; else, use array
    let contentCell;
    if (tabContent.length === 1) {
      contentCell = tabContent[0];
    } else if (tabContent.length > 1) {
      // Wrap multiple nodes in a div to preserve structure
      const wrapper = document.createElement('div');
      tabContent.forEach(n => wrapper.appendChild(n.cloneNode(true)));
      contentCell = wrapper;
    } else {
      contentCell = '';
    }

    rows.push([label, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the table
  tabsRoot.replaceWith(table);
}
