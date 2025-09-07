/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  if (!element || !element.classList.contains('cmp-tabs')) return;

  // Header row as per requirements
  const headerRow = ['Tabs (tabs12)'];

  // Find all tab labels
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist > li'));
  // Find all tab panels (content)
  const tabPanels = Array.from(element.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If no tabs or panels, do nothing
  if (!tabLabels.length || !tabPanels.length) return;

  // Build rows: each row is [tab label, tab content]
  const rows = tabLabels.map((tabLabel, idx) => {
    // Get the tab label text
    const labelText = tabLabel.textContent.trim();

    // Find the corresponding tabpanel by aria-controls/id
    let panel = null;
    const ariaControls = tabLabel.getAttribute('aria-controls');
    if (ariaControls) {
      panel = element.querySelector(`#${ariaControls}`);
    }
    // Fallback: use index if not found
    if (!panel && tabPanels[idx]) {
      panel = tabPanels[idx];
    }
    if (!panel) return null;

    // For tab content, clone the panel and remove the tab title (h3) if present
    const panelClone = panel.cloneNode(true);
    // Remove the tab title (h3) if present
    const h3 = panelClone.querySelector('h3.cmp-contentfragment__title');
    if (h3) h3.remove();
    // Remove empty grid divs
    panelClone.querySelectorAll('.aem-Grid').forEach(d => d.remove());
    // Remove empty wrapper divs
    panelClone.querySelectorAll('div').forEach(d => {
      if (!d.textContent.trim() && d.children.length === 0) d.remove();
    });

    // Use the HTML content of the cleaned panel
    let tabContent = document.createElement('div');
    Array.from(panelClone.childNodes).forEach(node => {
      if (!(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())) {
        tabContent.appendChild(node);
      }
    });
    return [labelText, tabContent];
  }).filter(Boolean);

  // Compose the table
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original tabs element with the new table
  element.replaceWith(table);
}
