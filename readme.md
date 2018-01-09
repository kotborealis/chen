![Cheeen~](http://i.imgur.com/Zkvz0Nm.png)
# Chen.js

:smiley_cat: Node.JS tool to parse cli arguments, enviroment variables and load configs from .js files 

## CLI arguments parser

### index.js

```
const args = require('chen.js').args;
const argv = args();
```
#### Examples
``node index.js --prop value --flag -abc just some args --type=pdf``
```
argv = {
	_: ['just', 'some', 'args'],
	prop: 'value',
	flag: true,
	a: true,
	b: true,
	type: 'pdf'
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
const config = require('chen').config; // loads default config
config('.config.js'); // loads .config.js and overrides it with values from args
```
By default, tries to load ``${cwd}/config/default.js``.
If called with string as an argument, trues to load specified file.

Values from file can be **overridden** by config file, specified by cli arguments (``--config ./path/to/config.js``)
and by cli arguments options that starts with ``--config.`` (like ``--config.something.somebody false`` will override ``something.somebody`` in loaded config).

You can safely access config properties using ``config.get(prop)``, where ``prop`` can be property name or property path (like ``a.b.c.d.e``).

Also, you can safely access cli arguments using ``config.get('args')``.

You can access config object using ``config.resolve()``. However, you can't mutate config object.

## Env parser

Loads and parses environment variables and .env files (via dotenv package).

### Examples
``A=1 B={"a": 1} C=string! node index.js``

.env
```
TEST=1337
```

```
const env = require('chen').env();
env['A'] === 1;
env['B'].a === 1;
env['C'] === 'string!';
env.TEST === 1337;
```