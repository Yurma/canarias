class Canarias {
    constructor(value) {
        this.nodes = [];
        this.currentValue = value || "";
    }

    track = (node) => {
        this.nodes.push(node);
        this.action(this.currentValue);
    }

    untrack = (removeNode) => {
        this.nodes.filter(
            (node) => node !== removeNode
        );
    }

    value = (val) => {
        if(val) {
            let currVal = val;
            if (typeof(val) === "object") {
                currVal = ((val) => {
                    if(Array.isArray(val)) {
                        let newVal = [];
                        for(const v of val) {
                            if (typeof(v) === "object") newVal.push(currVal(v));
                            else newVal.push(new Canarias(v));
                        }
                        return newVal;
                    } else {
                        let newVal = {};
                        for(const [key, value] of Object.entries(val)){
                            if (typeof(v) === "object") newVal[key] = currVal(value);
                            else newVal[key] = new Canarias(value);
                        }
                        return newVal;
                    }
                })(val);
            }
            this.currentValue = currVal;
        }
        return this.currentValue;
    }

    action = (value) => {
        for(const node of this.nodes) {
            node.textContent = value; 
        }
    }
}