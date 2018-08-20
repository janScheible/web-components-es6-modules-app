import PageHTMLElement from '../../../framework/PageHTMLElement.js';

import * as ButtonWidget from '../../../widget/button/Button.js';
import * as HeadingWidget from '../../../widget/heading/Heading.js';
import * as HyperhtmlExampleWidget from '../../../widget/hyperhtml-example/HyperhtmlExample.js';

(async () => {
	const templateEl = await PageHTMLElement.loadTemplate('./page/main/first/first.html');

	customElements.define('first-sub-page', class extends PageHTMLElement {
		constructor() {
			super(templateEl);
		}

		onShow() {
			console.log('starting FirstSubPage#onShow()');
			return new Promise(function (resolve, reject) {
				setTimeout(function () {
					console.log('finishing FirstSubPage#onShow()');
					resolve(":-)");
				}, 2000);
			});
		}
	});
})();
