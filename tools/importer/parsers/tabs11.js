/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
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

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header first
  const rows = [
    ['Tabs (tabs11)']
  ];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: skip empty
    if (!label || !panel) continue;

    // For content, use the entire tabpanel's content (not the tabpanel wrapper itself)
    // Usually the first child is a .contentfragment, but we want all visible content
    // We'll collect all children of the tabpanel
    const contentNodes = Array.from(panel.childNodes).filter(
      node =>
        (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') ||
        (node.nodeType === 3 && node.textContent.trim())
    );
    // If only one element, just use it, else use array
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : contentNodes;

    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the table
  tabs.replaceWith(table);
}
