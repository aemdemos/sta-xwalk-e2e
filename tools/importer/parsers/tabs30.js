/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a .cmp-tabs block
  if (!element.classList.contains('cmp-tabs')) return;

  // Header row as required
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // Get tab labels (li elements)
  const tabList = element.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels by aria-controls for correct mapping
  const tabPanels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      const tabId = li.getAttribute('aria-controls');
      const panel = element.querySelector(`#${tabId}`);
      tabPanels.push(panel);
    });
  }

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent = '';
    if (panel) {
      // Use all content inside the tabpanel (clone for safety)
      const content = Array.from(panel.childNodes).map(node => node.cloneNode(true));
      tabContent = document.createElement('div');
      content.forEach(node => tabContent.appendChild(node));
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
