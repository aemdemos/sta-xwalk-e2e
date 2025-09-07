/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs11)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: skip if no label or panel
    if (!label || !panel) continue;

    // For tab content, include the entire panel's content (not the panel wrapper)
    // We'll collect all direct children of the panel
    const contentNodes = Array.from(panel.childNodes).filter(node => {
      // Remove empty text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });

    // If only one element, just use it; else, use array
    let tabContent;
    if (contentNodes.length === 1) {
      tabContent = contentNodes[0];
    } else {
      tabContent = contentNodes;
    }

    rows.push([label, tabContent]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block
  tabs.replaceWith(block);
}
