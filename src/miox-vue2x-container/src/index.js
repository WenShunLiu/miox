import isClass from 'is-class';
import Vue from 'vue';

export default webView => {
    if (!webView) return;
    webView = checkWebViewObject(webView);
    return app => {
        const element = app.get('container') || global.document.body;
        app.on('app:start', async () => {
            const el = await new Promise((resolve, reject) => {
                const vm = new webView();
                if (typeof vm.MioxInjectDestroy !== 'function') {
                    return reject(new Error('wrong webView container'));
                }
                vm.$mount(element);
                vm.$on('webview:mounted', () => resolve(vm.mioxContainerElement));
            });

            if (!el) throw new Error('miss container element');
            app.set('container', el);
        });
    }
}

function checkWebViewObject(webview) {
    if ( !isClass(webview) && typeof webview !== 'function' ){
        try{
            webview = Vue.extend(webview);
        } catch(e) {
            throw new Error('`webview` argument is not a class object or a function or an object.');
        }
    }
    return webview;
}