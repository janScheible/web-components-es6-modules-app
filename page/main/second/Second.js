import PageHTMLElement from '../../../framework/PageHTMLElement.js';

import * as ButtonWidget from '../../../widget/button/Button.js';
import * as HeadingWidget from '../../../widget/heading/Heading.js';
import * as PreactExampleWidget from '../../../widget/preact-example/PreactExample.js';

(async () => {
	const templateEl = await PageHTMLElement.loadTemplate('./page/main/second/second.html');

	customElements.define('second-sub-page', class extends PageHTMLElement {
		constructor() {
			super(templateEl);
		}
	});
})();
