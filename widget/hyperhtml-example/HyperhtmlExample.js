import hyperHTML from 'https://unpkg.com/hyperhtml@2.11.3/esm/index.js?module';

export class HyperhtmlExample extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        function tick(render) {
            render`
              <div>
                <span><a href="https://github.com/WebReflection/hyperHTML">hyperHTML</a> says:</span>
                <span>It is ${new Date().toLocaleTimeString()}.</span>
              </div>
            `;
        }

        const render = hyperHTML(this.shadowRoot);
        tick(render);
        this._timerId = setInterval(tick, 1000, render);
    }

    disconnectedCallback() {
        clearInterval(this._timerId);
    }
}

customElements.define('hyperhtml-example-widget', HyperhtmlExample);