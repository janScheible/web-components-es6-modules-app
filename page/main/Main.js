import PageHTMLElement from '../../framework/PageHTMLElement.js';
import Router from '../../framework/Router.js';

import * as HeadingWidget from '../../widget/heading/Heading.js';
import Tabs from 'https://unpkg.com/elix@2.2.3/src/Tabs.js';

(async () => {
	const templateEl = await PageHTMLElement.loadTemplate('./page/main/main.html');

	customElements.define('main-page', class extends PageHTMLElement {
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

			this._dataLoaded = false;
		}

		async onShow() {
			if (!this._dataLoaded) {
				console.log('initial starting MainPage#onShow()');
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						console.log('finishing MainPage#onShow()');
						this._dataLoaded = true;
						resolve();
					}, 2000);
				});
			} else {
				console.log('skipping MainPage#onShow()');
			}			
		}

		_changeSubPage(updateUrl) {
			const subPageName = this._tabsEl.selectedItem.getAttribute('id').replace('-tab-button', '');
			const routeWithSubPage = '#' + this.getBaseRoute() + '/' + subPageName;
			Router.changeRoute(routeWithSubPage, updateUrl);
		}

		afterShowLeafPage() {
			this._changeSubPage(false);
		}
	});
})();
