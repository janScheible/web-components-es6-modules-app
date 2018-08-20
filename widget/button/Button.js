import TemplatedHTMLElement from '../../framework/TemplatedHTMLElement.js';

(async () => {
	const templateEl = await TemplatedHTMLElement.loadTemplate('./widget/button/button.html');

	
	customElements.define('button-widget', class extends TemplatedHTMLElement {
		constructor() {
			super(templateEl);
		}

		connectedCallback() {
			// NOTE Moved the text of the default slot to the value attribute of the input.
			const buttonTextNode = this.shadowRoot.querySelector('slot').assignedNodes()[0];

			const buttonText = buttonTextNode.textContent;
			buttonTextNode.textContent = '';

			this.shadowRoot.querySelector('input').setAttribute('value', buttonText);
		}
	});
})();
