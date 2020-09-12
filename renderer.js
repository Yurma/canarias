function createElement(obj) {
    if (obj.type) {
        let element = document.createElement(obj.type);
        if(obj.type === "TEXT_ELEMENT") element = document.createTextNode(obj.value);
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
        if(Array.isArray(obj.children)) {
            for(const child of obj.children) {
                element.appendChild(createElement(child));
            }
        }
        if(obj.track) obj.track(element);
        if(obj.text) element.textContent = obj.text;

        return element;
    }

    return null;
}

function removeChildren(node) {
    while(node.firstChild) {
        node.removeChild(node.lastChild)
    }
}

function removeChild(parentNode, node) {
    for(const child of parentNode.childNodes){
        if (node.isEqualNode(child)) parentNode.removeChild(child);
    }
}