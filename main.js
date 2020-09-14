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
                    type: "component",
                    condition: () => createCondition(store.y.val[0].value === "Nice"),
                    component: ShowComponent(),
                    store: y1,
                    track: true
                },
                {
                    type: "span",
                    text: y1.value,
                    store: y1, 
                    track: true
                }
            ]
        })
    }

    const ShowComponent = function(store) {
        return createElement({
            type: "TEXT_ELEMENT",
            text: "OOOO",
            class: "show"
        });
    }
    
    namespace.renderTree = function (store) {
        removeChildren(this);
        this.appendChild(AppComponent(store));
        store.y.val[0].track(() => conditionRender(store.y.val[0].value == "Texst", this, ShowComponent(store)));

    }
})(window.namespace = window.namespace || {})