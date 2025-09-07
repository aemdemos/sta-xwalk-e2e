/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.closest('.tabs');
  if (!tabsRoot) return;

  // Find the tab labels (li elements)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Build rows: header first
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];

  // For each tab, get label and content
  tabLabels.forEach((tabLabel) => {
    const label = tabLabel.textContent.trim();
    const panelId = tabLabel.getAttribute('aria-controls');
    const panel = tabsRoot.querySelector(`#${panelId}`);
    let content = '';
    if (panel) {
      // Use all content inside the tabpanel
      const frag = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => frag.appendChild(node.cloneNode(true)));
      content = frag;
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element
  tabsRoot.replaceWith(block);
}
