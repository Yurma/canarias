class Canarias {
    constructor(value) {
        this.nodes = [];
        this.compareNodes = [];
        this.conditions = [];
        this.components = [];
        this._value = value || "";
        this.value = value || "";
        return this._value;
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
        if (node instanceof HTMLElement) {
            this.nodes.push(node);
        }
        if (typeof(node) === "function") this.components.push(node);
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