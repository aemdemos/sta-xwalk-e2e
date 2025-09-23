/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Hero (hero2)'];

  // Find the hero image (picture or img)
  const imageEl = element.querySelector('picture') || element.querySelector('img') || '';
  const imageRow = [imageEl];

  // Compose content: title (h1), subheading (h2/h3), CTA (a), paragraphs (not images)
  const content = [];
  const headingEl = element.querySelector('h1');
  if (headingEl) content.push(headingEl);
  const subheadingEl = element.querySelector('h2, h3');
  if (subheadingEl) content.push(subheadingEl);
  // Paragraphs that are not just images
  const paragraphEls = Array.from(element.querySelectorAll('p')).filter(p => !p.querySelector('picture, img') && p.textContent.trim());
  content.push(...paragraphEls);
  // CTA: first <a>
  const ctaEl = element.querySelector('a');
  if (ctaEl) content.push(ctaEl);
  // The content row must always be present (even if empty)
  const contentRow = [content.length ? content : ''];

  // Ensure the table always has 3 rows: header, image, and content
  const cells = [headerRow, imageRow, contentRow];
  while (cells.length < 3) cells.push(['']);

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
