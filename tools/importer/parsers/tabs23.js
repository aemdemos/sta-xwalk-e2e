/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (tab content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows: first row is always the block name
  const rows = [ ['Tabs (tabs23)'] ];

  // For each tab, find its label and corresponding content
  tabLabels.forEach((tabLabel, idx) => {
    // Get the aria-controls attribute to match to the panel
    const controls = tabLabel.getAttribute('aria-controls');
    let panel = null;
    if (controls) {
      panel = tabs.querySelector(`#${controls}`);
    }
    // Fallback: use index if not found
    if (!panel && tabPanels[idx]) {
      panel = tabPanels[idx];
    }
    if (!panel) return;

    // Tab label cell: use the label textContent
    const labelCell = tabLabel.textContent.trim();

    // Tab content cell: reference the panel's content
    // If the panel has a single child (e.g. .contentfragment), use that child for a cleaner cell
    let contentCell;
    if (panel.children.length === 1) {
      contentCell = panel.children[0];
    } else {
      contentCell = panel;
    }

    rows.push([labelCell, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
