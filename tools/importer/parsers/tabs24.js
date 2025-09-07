/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is a tabs block
  if (!element || !element.classList.contains('tabs')) return;

  // Find the cmp-tabs element inside this block
  const cmpTabs = element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist (ol > li)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If mismatch, bail
  if (tabLabels.length !== tabPanels.length) return;

  // Build rows: header, then one row per tab
  const rows = [];
  // Header row as per spec
  const headerRow = ['Tabs (tabs24)'];
  rows.push(headerRow);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // For content, grab all content inside the tabpanel
    // We'll collect all childNodes (including text and elements)
    const contentNodes = Array.from(panel.childNodes).filter(n => {
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return true;
    });
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0].cloneNode(true);
    } else {
      // Wrap multiple nodes in a div
      const wrapper = document.createElement('div');
      contentNodes.forEach(n => wrapper.appendChild(n.cloneNode(true)));
      contentCell = wrapper;
    }
    rows.push([label, contentCell]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
