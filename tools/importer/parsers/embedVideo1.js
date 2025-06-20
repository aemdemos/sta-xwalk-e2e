/* global WebImporter */
export default function parse(element, { document }) {
  // Compose a string of all visible navigation text in order
  // This includes brand, nav sections/links, and search icon's semantic meaning
  // We'll retain some elements for structure, i.e., brand as <strong> and links
  const contentFragments = [];

  // Brand (e.g., 'Boilerplate')
  const brand = element.querySelector('.nav-brand');
  if (brand) {
    // Try to find the anchor tag inside brand
    const brandLink = brand.querySelector('a');
    if (brandLink) {
      // Use strong for brand
      const strong = document.createElement('strong');
      strong.textContent = brandLink.textContent.trim();
      contentFragments.push(strong);
    }
  }

  // Navigation Sections (main menu)
  const navSections = element.querySelector('.nav-sections');
  if (navSections) {
    const lis = navSections.querySelectorAll('li.nav-drop');
    lis.forEach((li) => {
      // Main nav section title
      contentFragments.push(document.createTextNode(' ' + li.firstChild.textContent.trim() + ' '));
      // Submenu links
      const submenuLinks = li.querySelectorAll('ul li a');
      submenuLinks.forEach((a) => {
        contentFragments.push(document.createTextNode(a.textContent.trim() + ' '));
      });
    });
  }

  // Search icon: represent with 'Q' (as in screenshot)
  // The rightmost icon
  const navTools = element.querySelector('.nav-tools');
  if (navTools) {
    // In the screenshot, the search icon is just a Q for simplicity
    contentFragments.push(document.createTextNode('Q'));
  }

  // Compose cell content
  // Remove any accidental trailing spaces
  let finalFragments = [];
  for (let i = 0; i < contentFragments.length; i++) {
    const frag = contentFragments[i];
    if (typeof frag === 'string' || frag instanceof Text) {
      if (frag.textContent && frag.textContent.trim()) {
        finalFragments.push(document.createTextNode(frag.textContent.trim() + ' '));
      } else if (typeof frag === 'string' && frag.trim()) {
        finalFragments.push(document.createTextNode(frag.trim() + ' '));
      }
    } else if (frag instanceof HTMLElement) {
      finalFragments.push(frag);
    }
  }

  // Remove trailing spaces from final text
  if (finalFragments.length && finalFragments[finalFragments.length-1] instanceof Text) {
    finalFragments[finalFragments.length-1].textContent = finalFragments[finalFragments.length-1].textContent.trim();
  }

  // Table structure
  const headerRow = ['Embed (embedVideo1)'];
  const cells = [
    headerRow,
    [finalFragments]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}