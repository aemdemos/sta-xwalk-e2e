/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block by class
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row as required
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // Get tab labels (in order)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tab panels (in order)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only pair as many as both exist
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: find the main content fragment/article inside the panel
    let content = null;
    // Try to find the content fragment/article or just use the panel's children
    const article = panel.querySelector('article');
    if (article) {
      // Remove the title (h3) if present, as the tab label already covers it
      const h3 = article.querySelector('h3');
      if (h3) h3.remove();
      // Remove empty grid wrappers
      Array.from(article.querySelectorAll('.aem-Grid')).forEach(grid => {
        if (!grid.textContent.trim() && !grid.querySelector('img')) grid.remove();
      });
      // Remove empty divs
      Array.from(article.querySelectorAll('div')).forEach(div => {
        if (!div.textContent.trim() && div.children.length === 0) div.remove();
      });
      // Use the .cmp-contentfragment__elements as the main content if present
      const elements = article.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        content = elements;
      } else {
        content = article;
      }
    } else {
      // Fallback: use the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
