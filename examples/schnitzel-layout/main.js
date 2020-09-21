(function (namespace, c) {
    const createElement = c.createElement;
    const removeChildren = c.removeChildren;
    
    const Header = function(props) {
        const store = props.store;

        return createElement({
            type: "header",
            class: "header border-bottom border-black p-5 f4",
            children: [
                {
                    type: "div",
                    class: "header-item--full",
                    children: [
                        {
                            type: "a",
                            attributes: {"href": "./"},
                            text: "Name"
                        }
                    ]
                },
                {
                    type: "div",
                    class: "header-item mr-5",
                    children: [
                        {
                            type: "button",
                            class: "btn btn-white btn-rounder explore-btn",
                            events: {"click": () => store.test.action("Name")},
                            text: "Explore"
                        }
                    ]
                },
                {
                    type: "div",
                    class: "header-item",
                    children: [
                        {
                            type: "details",
                            class: "header-dropdown",
                            attributes: {"id": "profile"},
                            children: [
                                {
                                    type: "summary",
                                    class: "btn btn-default px-7 header-button",
                                    children: [
                                        {
                                            type: "span",
                                            text: store.username.value,
                                            props: {
                                                "store": store.username
                                            },
                                            track: true
                                        },
                                        {
                                            type: "i",
                                            class: "arrow"
                                        }
                                    ]
                                },
                                {
                                    type: "ul",
                                    class: "header-dropdown-menu dropdown-menu-dark",
                                    children: [
                                        {
                                            type: "button",
                                            class: "dropdown-item btn py-3",
                                            events: {"click": () => store.usernameChange("Fran")},
                                            text: "View profile"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }

    const AppComponent = function(props) {
        const store = props.store;
        return createElement({
            type: "div",
            class: "App",
            props: props,
            component: AppComponent,
            children: [
                {
                    type: "component",
                    component: Header,
                    props: {
                        "store": store
                    }
                },
                {
                    type: "div",
                    class: "container",
                    children: [
                        {
                            type: "div",
                            class: "posts",
                            props: props,
                            children: [... store.posts.map(post => ({
                                type: "component",
                                component: Post,
                                props: {
                                    "store": post
                                }
                            })), {
                                type: "div",
                                class: "card col-9 my-6",
                                condition: () => c.createCondition(store.username.value == "Fran"),
                                props: {"store": store.username},
                                track: true,
                                children: [
                                    {
                                        type: "div",
                                        class: "f5 pr-5 mb-n3 mt-3 top-card",
                                        children: [
                                            {
                                                type: "span",
                                                class: "author mr-2",
                                                track: true,
                                                events: {"click": () => console.log(store)},
                                                props: {
                                                    "store": store.username
                                                },
                                                text: "Me"
                                            }
                                        ]
                                    }, 
                                    {
                                        type: "div",
                                        class: "card-body",
                                        children: [
                                            {
                                                type: "h3",
                                                class: "inspa",
                                                props: {
                                                    "store": store.test
                                                },
                                                text: `Thank you {{ '${store.test.value}' || track }} {{ 2 }} `
                                            },
                                            {
                                                type: "div",
                                                class: "f5 description",
                                                text: "Very nice!!"
                                            }
                                        ]
                                    }
                                ]
                            }]
                        }
                    ]
                }
            ]
        })
    }

    const Post = function(props) {
        const store = props.store;
        return createElement({
            type: "div",
            class: "card col-9 my-6",
            children: [
                {
                    type: "div",
                    class: "f5 pr-5 mb-n3 mt-3 top-card",
                    children: [
                        {
                            type: "span",
                            class: "author mr-2",
                            track: true,
                            events: {"click": () => console.log(store)},
                            props: {
                                "store": store.author
                            },
                            text: store.author.value
                        }
                    ]
                },
                {
                    type: "div",
                    class: "card-body",
                    children: [
                        {
                            type: "h3",
                            text: store.title.value
                        },
                        {
                            type: "div",
                            class: "f5 description",
                            text: store.description.value
                        }
                    ]
                }
            ]
        })
    }
    
    namespace.renderTree = function (store) {
        removeChildren(this);
        this.appendChild(AppComponent({store}));

    }
})(window.namespace = window.namespace || {}, window.canarias = window.canarias || {})