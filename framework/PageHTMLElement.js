import TemplatedHTMLElement from './TemplatedHTMLElement.js';

export default class PageHTMLElement extends TemplatedHTMLElement {

	constructor(templateEl) {
		super(templateEl);
	}

	showSubPage(subPage) {
		let subPageEl = this.querySelector(subPage);
		
		if (!subPageEl) {
			subPageEl = document.createElement(subPage);
			subPageEl.setAttribute('slot', subPage);
			this.appendChild(subPageEl);
		} else {
			subPageEl.hidden = false;
		}

		this.dispatchEvent(new CustomEvent('subpageshowed', { detail: { subPage: subPage } }));

		return subPageEl;
	}

	setBaseRoute(baseRoute) {
		this._baseRoute = baseRoute;
	}

	getBaseRoute() {
		return this._baseRoute;
	}

	/**
	 * On show callback for performing actions right after the page is shown.
	 */
	async onShow() {
	}

	/**
	 * Callback invoked after a leaf page (means that the current route does not contains any sub-pages) was shown.
	 */
	afterShowLeafPage() {
	}

	hideSubPage(subPage) {
		let subPageEl = this.querySelector(subPage);
		subPageEl.hidden = true;
	}

	/**
	 * On hide callback for performing actions right before the page is hidden.
	 */
	onHide() {
	}
}