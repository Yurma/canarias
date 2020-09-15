function createElement(obj, parentNode) {
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
                        let componentFunc = document.createTextNode("");
                        const parent = element.parentNode || obj.parentNode;
                        if(obj.component && !obj.store) componentFunc = obj.component(null, parent);
                        if(obj.component && obj.store) componentFunc = obj.component(obj.store, parent);
                        console.log(componentFunc.childNodes.length, element.childNodes.length, obj.children.length)
                        compareNodes(componentFunc, element);
                        //removeChildren(parent);
                        //parent.appendChild(componentFunc);
                    }, () => {
                        removeChild(element, createElement(child, parentNode))
                    });
                }
                if((typeof(child.condition) === "function" && child.condition()) || !child.condition) element.appendChild(createElement(child, element));
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
            if (node.isEqualNode(child)) console.log("Do",parentNode.removeChild(child));
        }
    }
}

function conditionRender (condition, parentNode, node) {
    if (parentNode instanceof HTMLElement && (node instanceof HTMLElement || node instanceof Text)) removeChild(parentNode, node);
    if(condition) {
        console.log("DO: ", parentNode, node)
        parentNode.appendChild(node);
    } else {
        console.log("DONT: ", [parentNode], node)
        removeChild(parentNode, node)
    }
}

function createCondition (condition) {
    return !!condition;
}

function compareNodes (node1, node2) {
    let len = node1.childNodes.length > node2.childNodes.length ? node1.childNodes.length : node2.childNodes.length;
    for(let i = 0; i<len; i++) {
        console.log([node1.childNodes[i], node2.childNodes[i]])
        if(!isEqualNode(node1.childNodes[i], node2.childNodes[i])) {
            console.log(node1.childNodes[i], node2.childNodes[i])
            node2.childNodes[i].replaceWith(node1.childNodes[i])
        };
    }
}

function isEqualNode(node1, node2) {
    let bool = true;
    if(!node1 && !node2) return bool;
    if(!node1 !== !node2) return false;
    if(node1.localName !== node2.localName 
    || node1.nodeName !== node2.nodeName
    || node1.nodeType !== node2.nodeType
    || node1.namespaceURI !== node2.namespaceURI) bool = false;
    if(node1.attributes && node2.attributes 
    && (node1.attributes.id !== node2.attributes.id
    || !isEqualNode(node1.attributes.type, node2.attributes.type)
    || node2.attributes.name !== node2.attributes.name)) bool = false;

    return bool;
}