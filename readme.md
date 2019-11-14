![Cheeen~](./img/chen.png)

# Chen.js :smiley_cat:

:smiley_cat: Node.JS tool to parse cli arguments, enviroment variables and load configs from .js files 

## CLI arguments parser

```js
// Called with args:
// --prop 100 --flag -abc input output --type="pdf document"

require('chen.js').args();

/**
{
	_: ['input', 'output'],
	prop: 100,
	flag: true,
	a: true,
	b: true,
	type: 'pdf document'
}
**/
```

## Config loader

```js
/**
* Loads `${PWD}/.config.js` by default
*/
const config = require('chen.js').config();
```

```js
/**
* Loads `${PWD}/.cfg.js`
*/
const config = require('chen.js').config('.cfg.js');
```

```js
/**
* Loads `${PWD}/.config.js`
* Loads `${PWD}/.config.dev.js` and overrides previous config
*/
const config = require('chen.js').config(['.config.js', '.config.dev.js']);
```

```js
/**
* Assuming called with CLI args: --config=.config.dev.js
* Loads `${PWD}/.config.js`
* Loads `${PWD}/.config.dev.js` and overrides previous config
*/
const config = require('chen.js').config();
```

```js
/**
* Assuming called with CLI args: --config=.config.dev.js --config=.config.dev2.js
* Loads `${PWD}/.config.js`
* Loads `${PWD}/.config.dev.js` and overrides previous config
* Loads `${PWD}/.config.dev2.js` and overrides previous config
*/
const config = require('chen.js').config();
```

## Env parser

Loads and parses environment variables and .env files (via dotenv package).

```js
const env = require('chen').env();
```
