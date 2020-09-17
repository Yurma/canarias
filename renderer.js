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
        if(obj.track && obj.props && obj.props.store) obj.props.store.track(element);
        if(obj.text) element.textContent = obj.text;
        if(Array.isArray(obj.children)) {
            for(const child of obj.children) {
                if(typeof(child.condition) === "function" && child.track && !obj.props.compare) {
                    child.props.store.addCondition(child.condition, () => {
                        if(child.elseComponent instanceof HTMLElement || child.elseComponent instanceof Text) {
                            if(childOf(element, child.elseComponent())) element.replaceChild(createElement(child).cloneNode([true]), findChild(element, child.elseComponent()));
                        }
                        else if(child.elseComponent){
                            if(childOf(element, createElement(child.elseComponent))) element.replaceChild(createElement(child).cloneNode([true]), findChild(element, createElement(child.elseComponent)));
                        }
                        else {
                            let componentFunc = document.createTextNode("");
                            const elemProps = {
                                ...obj.props,
                                compare: true
                            }
                            const newObj = {
                                ...obj,
                                props: {
                                    ...obj.props,
                                    compare: true
                                }
                            }
                            if(obj.component) componentFunc = obj.component(elemProps) || createElement(newObj);
                            compareNodes(componentFunc, element);
                        }
                        //removeChildren(parent);
                        //parent.appendChild(componentFunc);
                    }, () => {
                        if(child.elseComponent instanceof HTMLElement || child.elseComponent instanceof Text) {
                            if(childOf(element, createElement(child))) element.replaceChild(child.elseComponent().cloneNode([true]), findChild(element, createElement(child)));
                        }
                        else if(child.elseComponent){
                            if(childOf(element, createElement(child))) element.replaceChild(createElement(child.elseComponent), findChild(element, createElement(child)));
                        }
                        else {
                            removeChild(element, createElement(child, parentNode))
                        }
                    });
                }
                if((typeof(child.condition) === "function" && child.condition()) || !child.condition) element.appendChild(createElement(child, element))
                else if((typeof(child.condition) === "function" && !child.condition()) || child.elseComponent) {
                    if(child.elseComponent instanceof HTMLElement || child.elseComponent instanceof Text) {
                        element.appendChild(child.elseComponent());
                    }
                    else {
                        element.appendChild(createElement(child.elseComponent))
                    }
                }
            }
        }

        return element;
    }

    return document.createTextNode("");
}

function findChild(parentNode, node) {
    if(parentNode instanceof HTMLElement && (node instanceof HTMLElement || node instanceof Text)) {
        for(const child of parentNode.childNodes){
            if (node.isEqualNode(child)) return child;
        }
    }
}

function childOf(parentNode, node) {
    if(parentNode instanceof HTMLElement && (node instanceof HTMLElement || node instanceof Text)) {
        for(const child of parentNode.childNodes){
            if (node.isEqualNode(child)) return true;
        }
    }
    return false;
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
    if (parentNode instanceof HTMLElement && (node instanceof HTMLElement || node instanceof Text)) removeChild(parentNode, node);
    if(condition) {
        parentNode.appendChild(node);
    } else {
        removeChild(parentNode, node)
    }
}

function createCondition (condition) {
    return !!condition;
}

function compareNodes (node1, node2) {
    if(typeof(node1.childNodes.length) === "number" && typeof(node2.childNodes.length) === "number"){ 
        let i = 0;
        while(node1.childNodes.length !== node2.childNodes.length || !equalChildren(node1, node2)) {
            if(node1.childNodes.length === node2.childNodes.length && !equalChildren(node1, node2)) {
                if(!isEqualNode(node1.childNodes[i], node2.childNodes[i])) node2.replaceChild(node1.childNodes[i].cloneNode([true]), node2.childNodes[i]) 
                i++;
                continue;
            } 
            if(isEqualNode(node1.childNodes[i], node2.childNodes[i])) {
                if(node1.childNodes[i] && node2.childNodes[i] && node1.childNodes[i].childNodes.length !== node2.childNodes[i].childNodes.length) compareNodes(node1.childNodes[i], node2.childNodes[i]); 
                ++i;
            } else {
                node2.insertBefore(node1.childNodes[i].cloneNode([true]), node2.childNodes[i]);
                --i;
            }
        }
    }
    return node2;
}

function equalChildren(node1, node2) {
    if(!node1 && !node2) return true;
    if(!node1 !== !node2) return false;
    if(node1.childNodes.length !== node2.childNodes.length) return false;
    let i = 0;
    while(i < node1.childNodes.length) {
        if(!isEqualNode(node1.childNodes[i], node2.childNodes[i])) return false;
        i++;
    }
    return true;
}

function isEqualNode(node1, node2) {
    let bool = true;
    if(!node1 && !node2) return bool;
    if(!node1 !== !node2) return false;
    if(node1.localName !== node2.localName 
    || node1.nodeName !== node2.nodeName
    || node1.nodeType !== node2.nodeType
    || node1.textContent !== node2.textContent
    || node1.namespaceURI !== node2.namespaceURI) bool = false;
    if(node1.attributes && node2.attributes 
    && (node1.attributes.id !== node2.attributes.id
    || !isEqualNode(node1.attributes.type, node2.attributes.type)
    || node2.attributes.name !== node2.attributes.name)) bool = false;

    return bool;
}