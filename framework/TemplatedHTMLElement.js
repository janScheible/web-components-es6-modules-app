export default class TemplatedHTMLElement extends HTMLElement {

	constructor(templateEl) {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(templateEl.content.cloneNode(true));
	}

	static async loadTemplate(htmlTemplateUrl) {
		// HTML template loading inspired by: https://ayushgp.github.io/html-web-components-using-vanilla-js/
		const response = await fetch(htmlTemplateUrl);
		const templateText = await response.text();
		const templateEl = new DOMParser().parseFromString(
			TemplatedHTMLElement._insertAfterTemplateTag(templateText,
				'<link rel="stylesheet" href="./theme.css">\n'
				+ '<link rel="stylesheet" href="' + htmlTemplateUrl.replace('.html', '.css') + '">'), 'text/html').querySelector('template');
		return templateEl;
	}

	static _insertAfterTemplateTag(templateText, htmlText) {
		return '<template>\n    ' + htmlText
			+ templateText.substr(templateText.indexOf('<template>') + '<template>'.length);
	}
}