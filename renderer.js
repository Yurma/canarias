function createElement(obj) {
    if (obj && obj.type) {
        let element = document.createTextNode("");
        if (obj.type !== "TEXT_ELEMENT" && obj.type !== "component") element = document.createElement(obj.type);
        if(obj.type === "TEXT_ELEMENT") element = document.createTextNode(obj.value);
        if(obj.type === "component" && obj.component) element = obj.component.cloneNode();
        if(obj.class) element.className = obj.class;
        if(typeof(obj.attributes) === "object") {
            for(const [name, value] of Object.entries(obj.attributes)) {
                element.setAttribute(name, value);
            }
        }
        if(obj.id) element.id = obj.id;
        if(typeof(obj.events) === "object") {
            for(const [name, callback] of Object.entries(obj.events)) {
                element.addEventListener(name, callback);
            }
        }
        if(obj.track) obj.store.track(element);
        if(obj.text) element.textContent = obj.text;
        if(Array.isArray(obj.children)) {
            for(const child of obj.children) {
                if(typeof(child.condition) === "function", child.track && child.type === "component") {
                    child.store.addCondition(child.condition, () => {
                        const parent = element.parentNode;
                        removeChildren(parent);
                        parent.appendChild(createElement(obj));
                    }, () => removeChild(element, createElement(child)));
                }
                if((typeof(child.condition) === "function" && child.condition()) || !child.condition) element.appendChild(createElement(child));
            }
        }

        return element;
    }

    return document.createTextNode("");
}

function removeChildren(parentNode) {
    if(parentNode instanceof HTMLElement) {
        while(parentNode.firstChild) {
            parentNode.removeChild(parentNode.lastChild)
        }
    }
}

function removeChild(parentNode, node) {
    if(parentNode instanceof HTMLElement && (node instanceof HTMLElement || node instanceof Text)) {
        for(const child of parentNode.childNodes){
            if (node.isEqualNode(child)) parentNode.removeChild(child);
        }
    }
}

function conditionRender (condition, parentNode, node) {
    if (parentNode instanceof HTMLElement && node instanceof HTMLElement) removeChild(parentNode, node);
    if(condition) {
        parentNode.appendChild(node);
    }
}

function createCondition (condition) {
    return !!condition;
}