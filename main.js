(function (namespace) {

    const AppComponent = function(props) {
        const store = props.store;
        return createElement({
            type: "div",
            class: "App",
            props: props,
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
                    elseComponent: {
                        type: "span",
                        text: "Cool"
                    },
                    props: {store: store.y.val[0]},
                    track: true
                },
                {
                    type: "span",
                    text: store.y.val[0].value,
                    props: {store: store.y.val[0]}, 
                    track: true
                },
                {
                    type: "ul",
                    condition: () => createCondition(store.y.val[0].value === "Nice"),
                    track: true,
                    props: {store: store.y.val[0]},
                    children: store.maps.map(x => ({
                        type: "li",
                        text: x
                    }))
                }
            ]
        })
    }

    const ShowComponent = function({store}) {
        return createElement({
            type: "TEXT_ELEMENT",
            text: "store.value",
            class: "show"
        });
    }
    
    namespace.renderTree = function (store) {
        removeChildren(this);
        this.appendChild(AppComponent({store}));
        store.y.val[0].track(() => conditionRender(store.y.val[0].value == "Texst", this, ShowComponent({store: store.y.val[0]})));

    }
})(window.namespace = window.namespace || {})