/**
 * A router that was inspired by: https://www.ynonperek.com/2017/08/24/vanilla-single-page-router-architecture/.
 * Every path is called a route. The individual fragments are custom element names of a PageHTMLElement sub classes.
 */
export default class Router {

	constructor(applicationShellEl) {
		this._applicationShellEl = applicationShellEl;

		this._hashChangeCounter = 0;
		this._currentRoute = [];
	}

	static changeRoute(route, updateUrl, force) {
		if(!location.hash.startsWith(route) || force === true) {
			const newUrl = location.href.substr(0, location.href.length - location.hash.length) + route;
			
			if(updateUrl) {
				location.assign(newUrl);
			} else {
				location.replace(newUrl);
			}
		}
	}

	async init() {
		await this._ensureCustomElement(this._applicationShellEl);
		await this._applicationShellEl.onShow();
		this._applicationShellEl.setBaseRoute('');

		addEventListener('hashchange', async (event) => {
			this._hashChanged();
		});
		this._hashChanged();
	}

	async _hashChanged() {
		const currentHash = location.hash;
		
		// NOTE The current counter value is later used for detection if the current routing has to be terminated.
		const currentHashChangeCounter = ++this._hashChangeCounter;

		if (currentHash.length > 0) {
			const newRoute = currentHash.substr(1).split('/');
			console.debug('new route: "' + newRoute.join('/') + '" (current route: "' + this._currentRoute.join('/') + '")');
			const hidesAndShows = this._calcHidesAndShows(newRoute);
			console.debug('hides and shows: {remaining route: "' + hidesAndShows.remainingRoute.join('/')
				+ '", to be hidden page names: "' + hidesAndShows.toBeHiddenPageNames.join('/')
				+ '", to be showed page names: "' + hidesAndShows.toBeShowedPageNames.join('/') + '}');

			for (const pageNameToBeHidden of hidesAndShows.toBeHiddenPageNames) {
				const toBeHiddenPageEl = document.querySelector(this._currentRoute.join(' > '));

				toBeHiddenPageEl.onHide();
				toBeHiddenPageEl.hidden = true;		
				
				if (pageNameToBeHidden !== this._currentRoute.pop()) {
					throw 'The current route and the calculated pages to be hidden got out of sync...';
				}
				console.debug('hid "' + pageNameToBeHidden + '" (currentRoute: "' + this._currentRoute.join('/') + '")');
			}

			const rootPageEl = hidesAndShows.remainingRoute.length === 0
				? this._applicationShellEl : document.querySelector(hidesAndShows.remainingRoute.join(' > '));
			let curentPageEl = rootPageEl;
			do {
				const currentPageName = hidesAndShows.toBeShowedPageNames.shift();
				if (!currentPageName) {
					curentPageEl.afterShowLeafPage();
					break;
				}

				const pageImportUrl = this._getPageImportUrlForCurrentRoute(currentPageName);
				console.debug('pageImportUrl: "' + pageImportUrl + '"');
				await import(pageImportUrl);

				const nextPageEl = curentPageEl.showSubPage(currentPageName);
				this._currentRoute.push(currentPageName);
				console.debug('showed "' + currentPageName + '" (currentRoute: "' + this._currentRoute.join('/') + '")');
				
				await this._ensureCustomElement(nextPageEl);
				nextPageEl.setBaseRoute(this._currentRoute.join('/'));

				this._showLoadMask(nextPageEl);
				await nextPageEl.onShow();
				this._hideLoadMask(nextPageEl);

				const hashChangedInTheMeanwhile = this._hashChangeCounter !== currentHashChangeCounter;
				if (hashChangedInTheMeanwhile) {
					console.debug('terminating routing cause hash was "' + currentHash + '"@' + currentHashChangeCounter + ' but is now "'
						+ location.hash + '"@' + this._hashChangeCounter);
					return;
				}
				curentPageEl = nextPageEl;
			} while (curentPageEl);
		} else {
			this._applicationShellEl.afterShowLeafPage();
		}
	}

	_showLoadMask(pageEl) {
		pageEl.classList.add('load-mask');

		const loaderEl = document.createElement('div');
		loaderEl.classList.add('loader');
		pageEl.shadowRoot.appendChild(loaderEl);
	}

	_hideLoadMask(pageEl) {
		pageEl.classList.remove('load-mask');

		const loaderEl = pageEl.shadowRoot.querySelector(':host > div.loader');
		pageEl.shadowRoot.removeChild(loaderEl);
	}

	/**
	 * Figures out which pages have to be shown and which have to be hidden.
	 * 
	 * const a = Router._hideNowInvisibleOnes(['a', 'b'], ['a', 'b', 'c']); // hide[], show[c]
	 * const b = Router._hideNowInvisibleOnes(['a', 'b', 'c'], ['a', 'b']); // hide[c], show[]
	 * const c = Router._hideNowInvisibleOnes(['a', 'b', 'c'], ['e']); // hide[c, b, a], show[e]
	 * const d = Router._hideNowInvisibleOnes(['a', 'b', 'c'], ['a', 'e']); // hide[c, b], show[e]
	 * const e = Router._hideNowInvisibleOnes(['c'], ['a', 'b']); // hide[c], show[a, b]
	 * const f = Router._hideNowInvisibleOnes([], ['a', 'b']); // hide[], show[a, b]
	 */
	_calcHidesAndShows(newRoute) {
		const currentRoute = this._currentRoute;
		let startIndex = Math.min(currentRoute.length, newRoute.length);
		// NOTE Find the index of the first difference (either unequality or differnt array lengths).
		for (let i = 0; i < currentRoute.length; i++) {
			if (!(newRoute.length > i && currentRoute[i] === newRoute[i])) {
				startIndex = i;
				break;
			}
		}

		return {
			remainingRoute: newRoute.slice(0, startIndex),
			toBeHiddenPageNames: currentRoute.slice(startIndex, currentRoute.length).reverse(),
			toBeShowedPageNames: newRoute.slice(startIndex, newRoute.length)
		}
	}

	/**
	 * In an early stage of the application lifecylce it is possible that page custom element is not yet ready.
	 */
	async _ensureCustomElement(customEl) {
		await customElements.whenDefined(customEl.localName);
	}

	_getPageImportUrlForCurrentRoute(currentPageName) {
		function firstCharToUpper(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		function removeAllPageSuffix(string) {
			return string.replace('-sub-page', '').replace('-page', '');
		}

		const pageImportUrl = '../page/'
			+ this._currentRoute.map(elName => removeAllPageSuffix(elName)).join('/')
			+ (this._currentRoute.length > 0 ? '/' : '') + removeAllPageSuffix(currentPageName)
			+ '/' + firstCharToUpper(removeAllPageSuffix(currentPageName)) + '.js';
		return pageImportUrl;
	}
}
