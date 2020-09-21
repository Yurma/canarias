(function(namespace, canarias) {
    const Canarias = canarias.Canarias;

    namespace.Store = function Store() {
        this.username = new Canarias("Yurma");
        this.test = new Canarias("Tesst");
        this.posts = new Canarias([
            {
                "title": "This is so good",
                "description": "Wooow, sooo nicee",
                "author": this.username
            },
            {
                "title": "Darn nice",
                "description": "This is so good. Thanks",
                "author": this.username
            }
        ]);

        this.usernameChange = (value) => {
            this.username.action(this.username.value == "Yurma" ? "Fran" : "Yurma");
        }
    }
})(window.namespace = window.namespace || {}, window.canarias = window.canarias || {})