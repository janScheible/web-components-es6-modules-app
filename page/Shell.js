import PageHTMLElement from '../framework/PageHTMLElement.js';
import Router from '../framework/Router.js';

import Tabs from 'https://unpkg.com/elix@2.2.3/src/Tabs.js';

(async () => {
	const templateEl = await PageHTMLElement.loadTemplate('./page/shell.html');

	customElements.define('application-shell', class extends PageHTMLElement {
		constructor() {
			super(templateEl);

			this._tabsEl = this.shadowRoot.querySelector('#tabs');
			this._tabsEl.addEventListener('selected-index-changed', (event) => {
				if(this.getBaseRoute() !== undefined) {
					this._changeSubPage(true);
				}
			});

			this.addEventListener('subpageshowed', (event) => {
				const subPageTabButtonEl = this.shadowRoot.querySelector('#' + event.detail.subPage + '-tab-button');
				this._tabsEl.selectedItem = subPageTabButtonEl;
			});
		}

		_changeSubPage(updateUrl) {
			const pageName = this._tabsEl.selectedItem.getAttribute('id').replace('-tab-button', '');
			const routeWithPage = '#' + pageName;
			Router.changeRoute(routeWithPage, updateUrl);
		}		

		afterShowLeafPage() {
			this._changeSubPage(false);
		}		
	});
})();
