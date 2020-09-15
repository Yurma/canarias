class Canarias {
    constructor(value) {
        this.nodes = [];
        this.compareNodes = [];
        this.conditions = [];
        this.components = [];
        this._value = value || "";
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

    addCompare = (node) => {
        if (node instanceof HTMLElement) {
            this.compareNodes.push(node);
        }
    }

    compareNode = (node, newNode) => {
        if (node instanceof HTMLElement) {
            for(const n of this.compareNodes) {
                if(n.isEqualNode(node)) console.log(n.parentNode, node.parentNode);
            }
        }
    }

    get val() {
        return this._value;
    }

    valueM = () => {
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
                        if (typeof(value) === "object") newVal[key] = valFun(value);
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
            if(oldValue === node.value) node.value = value;
        }
        for(const component of this.components) {
            component();
        }
        for(const condObject of this.conditions) {
            if(condObject.condition()) {
                this.removeCondition(condObject)
                condObject.callback();
            }else {
                condObject.elseCallback();
            }
        }
    }
}

// function Canarias(value) {
//     let nodes = [];
//     let components = [];
//     let currentValue = value || ""; 

//     this.track = (node) => {
//         if (node instanceof HTMLElement) nodes.push(node);
//         if (typeof(node) === "function") components.push(node);
//         this.action(currentValue);
//     }
    
//     this.untrack = (removeNode) => {
//         nodes.filter(
//             (node) => node !== removeNode
//         );
//     }

//     this.value = (val) => {
//         if(val) {
//             let currVal = val;
//             if (typeof(val) === "object") {
//                 currVal = ((val) => {
//                     if(Array.isArray(val)) {
//                         let newVal = [];
//                         for(const v of val) {
//                             if (typeof(v) === "object") newVal.push(currVal(v));
//                             else newVal.push(new Canarias(v));
//                         }
//                         return newVal;
//                     } else {
//                         let newVal = {};
//                         for(const [key, value] of Object.entries(val)){
//                             if (typeof(v) === "object") newVal[key] = currVal(value);
//                             else newVal[key] = new Canarias(value);
//                         }
//                         return newVal;
//                     }
//                 })(val);
//             }
//             currentValue = currVal;
//         }
//         return currentValue;
//     }

//     this.action = (value) => {
//         this.value(value);
//         for(const node of nodes) {
//             node.textContent = value; 
//         }
//         for(const component of components) {
//             component();
//         }
//     }

// }