(function (namespace) {

    const AppComponent = function(store) {
        let y1 = store.y.val[0];
        return createElement({
            type: "div",
            class: "App",
            children: [
                {
                    type: "input",
                    attributes: {"type": "text", "value": y1.value},
                    events: {"keyup": (event) => y1.action(event.target.value)},
                },
                {
                    type: "span",
                    track: y1.track
                }
            ]
        })
    }

    const ShowComponent = function(store) {
        return createElement()
    }
    
    namespace.renderTree = function (store) {
        removeChildren(this);
        this.appendChild(AppComponent(store));
        store.y.val[0].track(() => conditionRender(store.y.val[0].value == "Texst", this, ShowComponent(store)));

    }
})(window.namespace = window.namespace || {})