(function (namespace) {

    const AppComponent = function(store, parentNode) {
        let y1 = store.y.val[0];
        return createElement({
            type: "div",
            class: "App",
            store: store,
            parentNode,
            component: AppComponent,
            children: [
                {
                    type: "input",
                    attributes: {"type": "text", "value": store.y.val[0].value},
                    events: {"keyup": (event) => store.y.val[0].action(event.target.value)},
                },
                {
                    type: "component",
                    condition: () => createCondition(store.y.val[0].value === "Nice"),
                    component: ShowComponent(store.y.val[0]),
                    store: store.y.val[0],
                    track: true
                },
                {
                    type: "span",
                    text: store.y.val[0].value,
                    store: store.y.val[0], 
                    track: true
                },
                {
                    type: "div",
                    children: store.maps.map(x => ({
                        type: "span",
                        text: x
                    }))
                }
            ]
        })
    }

    const ShowComponent = function(store) {
        return createElement({
            type: "TEXT_ELEMENT",
            text: "store.value",
            class: "show"
        });
    }
    
    namespace.renderTree = function (store) {
        removeChildren(this);
        this.appendChild(AppComponent(store));
        store.y.val[0].track(() => conditionRender(store.y.val[0].value == "Texst", this, ShowComponent(store.y.val[0])));

    }
})(window.namespace = window.namespace || {})