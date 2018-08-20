import { h, render as preactRender } from 'https://unpkg.com/preact@8.2.9/dist/preact.esm.js';

export class PreactExample extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        function tick(render) {
            render(h('div', {}, [
                h('span', {}, [
                    h('a', { 'href': 'https://github.com/developit/preact' }, 'Preact'), ' says:'
                ]),
                h('span', {}, 'It is ' + new Date().toLocaleTimeString() + '.')
            ]));
        }

        const render =  (vnode) => preactRender(vnode, this.shadowRoot, this.shadowRoot);
        tick(render);
        this._timerId = setInterval(tick, 1000, render);
    }

    disconnectedCallback() {
        clearInterval(this._timerId);
    }
}

customElements.define('preact-example-widget', PreactExample);