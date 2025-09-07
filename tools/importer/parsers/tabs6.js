/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the .cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabs.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build rows: header first
  const rows = [
    ['Tabs (tabs6)'],
  ];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Defensive: find the corresponding panel by aria-controls
    const ariaControls = labelEl.getAttribute('aria-controls');
    const panel = tabPanels.find(
      (p) => p.id === ariaControls
    );
    if (!panel) return;

    // Tab label: use textContent (trimmed)
    const label = labelEl.textContent.trim();

    // Tab content: use the entire panel content (clone children to avoid moving them)
    // But we want to preserve the DOM nodes, so we can reference the panel's children directly
    // We'll collect all immediate children of the panel
    const contentNodes = Array.from(panel.childNodes).filter(
      (n) => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
    );
    // If only one element, just use it, else use array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      contentCell = contentNodes;
    }

    rows.push([label, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the table
  tabs.replaceWith(table);
}
