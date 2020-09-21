(function(can){
    can.Canarias = class Canarias {
        constructor(value) {
            this.nodes = [];
            this.compareNodes = [];
            this.conditions = [];
            this.components = [];
            this._value = value || "";
            this.value = value || "";
            return this._value;
        }

        isCanarias()  {
        	return true;
        }
    
        addCondition = (condition, callback, elseCallback) => {
            this.conditions.push({
                condition,
                callback,
                elseCallback
            })
        }
    
        removeCondition = (condition) => {
            this.conditions = this.conditions.filter(
                (x) => x !== condition
            )
        }
    
        track = (node) => {
            this.untrack(node);
            console.log(node)
            if (node instanceof HTMLElement || node instanceof Text) {
                this.nodes.push(node);
            }
            if (typeof(node) === "function") this.components.push(node);
            return true;
        }
    
        untrack = (removeNode) => {
            if (removeNode instanceof HTMLElement) this.nodes = this.nodes.filter(
                (node) => node !== removeNode
            );
            if (typeof(node) === "function") this.components =  this.components.filter(
                (node) => node !== removeNode
            );
        }
    
        get val() {
            return this._value;
        }
    
        get value() {
            let currVal = this._value;
            let val = this._value;
            if (typeof(val) === "object") {
                let valFun = (val) => {
                    if(Array.isArray(val)) {
                        let newVal = [];
                        for (const v of val) {
                            if (typeof(v) === "object" && !(v instanceof Canarias)) newVal.push(valFun(v));
                            else newVal.push(v._value);
                        }
                        return newVal;
                    } else if (!(val instanceof Canarias) && typeof(val) !== "string" && typeof(val) !== "number" && typeof(val) !== "boolean") {
                        let newVal = {};
                        for (const [key, value] of Object.entries(val)) {
                            if (Array.isArray(value)) newVal[key] = valFun(value);
                            else if (value instanceof Canarias) newVal[key] = valFun(value._value);
                            else newVal[key] = value;
                        }
                        return newVal;
                    } 
                    return val;
                };
                currVal = valFun(val)
            }
            return currVal;
        }
    
    
        set value(val) {
            let currVal = val;
            if (typeof(val) === "object") {
                let valFun = (val) => {
                    if(Array.isArray(val)) {
                        let newVal = [];
                        for(const v of val) {
                            if (typeof(v) === "object") newVal.push(valFun(v));
                            else newVal.push(new Canarias(v));
                        }
                        return newVal;
                    } else {
                        let newVal = {};
                        for(const [key, value] of Object.entries(val)){
                            if (value instanceof Canarias) newVal[key] = value;
                            else if (typeof(value) === "object") newVal[key] = valFun(value);
                            else newVal[key] = new Canarias(value);
                        }
                        return newVal;
                    }
                };
    
                currVal = valFun(val);
            }
            this._value = currVal;
        }
    
        action = (value) => {
        	console.log(this.nodes)
            let oldValue = this.value;
            if(value === this.value) return;
            this.value = value;
            for(const node of this.nodes) {
                if(oldValue === node.textContent) node.textContent = value; 
                if(oldValue === node.value) node.setAttribute("value", value)
            }
            for(const component of this.components) {
                component();
            }
            for(const condObject of this.conditions) {
                if(condObject.condition()) {
                    condObject.callback();
                }else {
                    condObject.elseCallback();
                }
            }
        }
    }

    can.createElement = function(obj, parentNode) {
    	console.log(obj)
        if (obj && obj.type) {
            let element = document.createTextNode("");
            if (obj.type !== "TEXT_ELEMENT" && obj.type !== "component") element = document.createElement(obj.type);
            if(obj.type === "TEXT_ELEMENT") element = document.createTextNode(obj.value);
            if(obj.type === "component" && typeof(obj.component) == "function") element = obj.component(obj.props);
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
                                if(obj.component) componentFunc = obj.component(elemProps);
                                else componentFunc = createElement(newObj);
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
                    } else {
                        element.appendChild(createElement(child))
                    }
                }
            }
            if(obj.text) {
            	if(obj.type === "TEXT_ELEMENT"){
            		element.textContent = obj.text;
            	}else {
            		if (obj.props && obj.props.store) nodeArray(element, stringToScript(obj.text, obj.props.store));
                	else nodeArray(element, stringToScript(obj.text))
            	}
            }
    
            return element;
        }
    
        return document.createTextNode("");
    }

    const createElement = can.createElement;
    
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
    
    can.removeChildren = function (parentNode) {
        if(parentNode instanceof HTMLElement) {
            while(parentNode.firstChild) {
                parentNode.removeChild(parentNode.lastChild)
            }
        }
    }
    
    can.removeChild = function (parentNode, node) {
        if(parentNode instanceof HTMLElement && (node instanceof HTMLElement || node instanceof Text)) {
            for(const child of parentNode.childNodes){
                if (node.isEqualNode(child)) parentNode.removeChild(child);
            }
        }
    }
    
    can.conditionRender = function (condition, parentNode, node) {
        if (parentNode instanceof HTMLElement && (node instanceof HTMLElement || node instanceof Text)) removeChild(parentNode, node);
        if(condition) {
            parentNode.appendChild(node);
        } else {
            removeChild(parentNode, node)
        }
    }
    
    can.createCondition = function (condition) {
        return !!condition;
    }

    const removeChildren = can.removeChildren;
    const removeChild = can.removeChild;
    const conditionRender = can.conditionRender;
    const createCondition = can.createCondition;

    function textScript (string) {
    	return Function(`'use strict'; return (${string})`)()
    }

    function nodeArray(element, array) {
    	for(const node of array) {
    		if (node instanceof HTMLElement || node instanceof Text) element.appendChild(node);
    	}	
    }

    function stringToScript(string, store) {
    	store && console.log(store.nodes)
	    let newStr = string;
	    let arr = [];
	    if((newStr.indexOf("{{") === -1) && (newStr.indexOf("}}") === -1)) arr.push(document.createTextNode(newStr));
	    else arr.push (document.createTextNode(newStr.substring(0, newStr.indexOf("{{"))));
	    while((newStr.indexOf("{{") !== -1) && (newStr.indexOf("}}") !== -1)){
	        let sub = newStr.substring(newStr.indexOf("{{") + 2, newStr.indexOf("}}"));
	        let full = "{{" + sub + "}}";
	        newStr = newStr.replace(full, "");
	        let txtNode = document.createTextNode(eval(sub));
        	if(sub.indexOf("||") !== -1) {
	        	let comms = sub.substring(sub.indexOf("||") + 2, sub.length);
	        	comms = comms.split(" ").filter(x => x);
	        	for (const comm of comms) {
	        		switch(comm) {
	        			case "track":
	        				if(store instanceof can.Canarias) console.log(store.track(txtNode));
	        				break;
	        			default: 
	        				console.log("Invalid command")
	        		}
	        	}
	        }
	        arr.push(txtNode);
	    }
	    return arr;
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
                if(node1.childNodes.length !== node2.childNodes.length && isEqualNode(node1.childNodes[i], node2.childNodes[i])) {
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
})(window.canarias = window.canarias || {})