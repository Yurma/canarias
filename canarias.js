class Canarias {
    constructor(value) {
        this.nodes = [];
        this.components = [];
        this._value = value || "";
        return this._value;
    }

    track = (node) => {
        if (node instanceof HTMLElement) {
            this.nodes.push(node);
            node.textContent = this._value;
        }
        if (typeof(node) === "function") this.components.push(node);
    }

    untrack = (removeNode) => {
        this.nodes.filter(
            (node) => node !== removeNode
        );
        if (typeof(node) === "function") this.components.filter(
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
        this.value = value;
        for(const node of this.nodes) {
            node.textContent = value; 
        }
        for(const component of this.components) {
            component();
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