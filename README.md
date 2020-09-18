# Canarias JS

*Still in development (not recommended)* 

Canarias is a minimalistic framework for vanilla JavaScript. It is not recommended for production usage and changes are certain.  

## Features

- Renderer
- Observer

## How does it work

Every observable value is its own object. Each object has the same methods. Those methods are used for tracking, setting value and changing value. Everywhere we set value from our observable ```variable.value = "newValue"``` or ```variable.action("newValue")```, we need to "track" with method ```track(`Node or function`)``` . When we change value of our observable with action ```variable.action("newValue")```, every item from array we added with track will execute, that can be either node, function or condition. 

## Contribute

- Issue Tracker: https://github.com/Yurma/canarias/issues
- Source Code: https://github.com/Yurma/canarias

## License

The project is licensed under the MIT license.