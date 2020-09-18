(function (namespace) {
    var store = new namespace.Store();
    namespace.renderTree.call(document.querySelector("#app"), store);
})(window.namespace = window.namespace || {})