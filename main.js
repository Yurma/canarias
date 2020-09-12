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
        return createElement({
            type: "div",
            class: "Show",
            text: "Shoooo"
        })
    }

    // let x1 = x.val.value;
    // let x2 = x.val.name[4][1].bob;
    // let y1 = y.val[0];
    // let y2 = y.val[1];


    // const app = document.querySelector("#app");
    // const input = document.createElement("input");
    // input.setAttribute("type", "text");
    // input.setAttribute("value", y1.value);
    // input.addEventListener("keyup", (event) => y1.action(event.target.value));

    // const span = document.createElement("span");
    // y1.track(span);
    
    // app.appendChild(input);
    // app.appendChild(span);

    // const input2 = document.createElement("input");
    // input2.setAttribute("type", "text");
    // input2.setAttribute("value", x2.value);
    // input2.addEventListener("keyup", (event) => x2.action(event.target.value));

    // const span2 = document.createElement("span");
    // x2.track(span2);
    
    // app.appendChild(input2);
    // app.appendChild(span2);

    
    namespace.renderTree = function (store) {
        removeChildren(this);
        this.appendChild(AppComponent(store));
        this.appendChild(createElement({
            type: "div",
            id: "Show"
        }));
        let show = document.querySelector("#Show");
        store.y.val[0].track(() => {
            removeChild(show, ShowComponent(store));
            if(store.y.val[0].value === "Show") {
                show.appendChild(ShowComponent(store));
            }
        })

    }
})(window.namespace = window.namespace || {})