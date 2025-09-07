/* global WebImporter */
export default function parse(element, { document }) {
  // Only run once on the main container
  if (!element.querySelector('.cmp-tabs')) return;
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map((li) => li.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')
  );

  if (tabLabels.length !== tabPanels.length) return;

  const rows = [];
  const headerRow = ['Tabs (tabs34)'];
  rows.push(headerRow);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Clone the panel to avoid moving nodes
    const panelClone = panel.cloneNode(true);
    // Remove h3.cmp-contentfragment__title if present
    const h3 = panelClone.querySelector('h3.cmp-contentfragment__title');
    if (h3) h3.remove();
    // Remove empty .aem-Grid containers
    panelClone.querySelectorAll('.aem-Grid').forEach(g => {
      if (!g.textContent.trim() && !g.querySelector('img')) g.remove();
    });
    // Remove empty divs
    panelClone.querySelectorAll('div').forEach(div => {
      if (!div.textContent.trim() && !div.querySelector('img')) div.remove();
    });
    // Use all children as tab content
    let tabContent = Array.from(panelClone.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
      return true;
    });
    if (tabContent.length === 1) tabContent = tabContent[0];
    rows.push([label, tabContent]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsRoot.replaceWith(table);
}
