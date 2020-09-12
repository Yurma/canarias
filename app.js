(function (namespace) {
    var store = new Store();
    namespace.renderTree.call(document.querySelector("#app"), store);
})(window.namespace = window.namespace || {})