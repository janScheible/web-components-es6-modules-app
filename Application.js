import Router from './framework/Router.js';
import * as ApplicationShell from './page/Shell.js'

(async () => {
    const router = new Router(document.querySelector('application-shell'));
    router.init();
})();