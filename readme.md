![Cheeen~](http://i.imgur.com/Zkvz0Nm.png)
# Chen
Smol node.js tool to parse cli arguments, env and load config

## CLI arguments parser
### index.js
```
const args = require('chen').args;
const argv = args();
```
#### Examples
``node index.js --prop value --flag -abc just some args``
```
argv = {
	_: ['just', 'some', 'args'],
	prop: 'value',
	flag: true,
	a: true,
	b: true
};
```


----------
``node index.js --json '{feels_good_man: 123}' --number 999999``
```
argv = {
	_: [],
	json: {feels_good_man: 123},
	number: 999999
};
```

## Config loader
### Examples
```
const config = require('chen').config;
config.load();
```
Loads default config (``${cwd}/config/default.js``), **overrides** it with config file, specified by cli arguments (``--config ./path/to/config.js``) and **overrides** it with cli arguments options that starts with ``--config.`` (like ``--config.something.somebody false`` will override ``something.somebody`` in loaded config).

You can safely access config properties using ``config.get(prop)``, where ``prop`` can be property name or property path (like ``a.b.c.d.e``).

Also, you can safely access cli arguments using ``config.get('args')``.

You can access config object using ``config.resolve()``. However, you can't mutate config object.

## Env parser
### Examples
``A=1 B={"a": 1} C=string! node index.js``
```
const env = require('chen').env;
env['A'] === 1;
env['B'].a === 1;
env['C'] === 'string!';
```