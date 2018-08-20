import PageHTMLElement from '../../framework/PageHTMLElement.js';

import * as ButtonWidget from '../../widget/button/Button.js'
import * as HeadingWidget from '../../widget/heading/Heading.js'

(async () => {
	const templateEl = await PageHTMLElement.loadTemplate('./page/about/about.html');

	customElements.define('about-page', class extends PageHTMLElement {
		constructor() {
			super(templateEl);
		}
	});
})();
