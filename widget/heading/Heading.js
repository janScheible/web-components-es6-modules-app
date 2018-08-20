import TemplatedHTMLElement from '../../framework/TemplatedHTMLElement.js';

(async () => {
	const templateEl = await TemplatedHTMLElement.loadTemplate('./widget/heading/heading.html');

	customElements.define('heading-widget', class extends TemplatedHTMLElement {
		constructor() {
			super(templateEl);
		}
	});
})();
