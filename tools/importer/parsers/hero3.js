/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  if (!heroTeaser) return;

  // Find the image (background image)
  let imageDiv = heroTeaser.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Find the content (title, subheading, CTA, etc.)
  let contentDiv = heroTeaser.querySelector('.cmp-teaser__content');
  let contentFragment = document.createDocumentFragment();
  if (contentDiv) {
    Array.from(contentDiv.childNodes).forEach(n => {
      if (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())) {
        contentFragment.appendChild(n.cloneNode(true));
      }
    });
  }
  const hasContent = contentFragment.childNodes.length > 0;

  // Build the table rows
  const headerRow = ['Hero (hero3)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [hasContent ? contentFragment : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
