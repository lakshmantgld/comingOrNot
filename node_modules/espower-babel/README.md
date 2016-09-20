# espower-babel [![Build Status](https://travis-ci.org/power-assert-js/espower-babel.svg?branch=master)](https://travis-ci.org/power-assert-js/espower-babel)

power-assert instrumentor for [Babel](https://babeljs.io/ "Babel · The transpiler for writing next generation JavaScript").

This module is wrapper of [babel-plugin-espower](https://github.com/power-assert-js/babel-plugin-espower "babel-plugin-espower").

## Purpose

- Writing ES6 tests with [Babel](http://babeljs.io/)
- Running tests with [power-assert](https://github.com/power-assert-js/power-assert) on the fly!
- No configuration

## DESCRIPTION

`espower-babel` is a Node.js module loader that instruments [power-assert](https://github.com/power-assert-js/power-assert) feature into target ECMAScript6 sources on the fly.

Please note that `espower-babel` is a beta version product. Pull-requests, issue reports and patches are always welcomed. See [power-assert](http://github.com/twada/power-assert) project for more documentation.

If you want to use with [Traceur](https://github.com/google/traceur-compiler "Traceur"), please see [yosuke-furukawa/espower-traceur](https://github.com/power-assert-js/espower-traceur "yosuke-furukawa/espower-traceur").

## EXAMPLE

Given `test/demo_test.js`

```javascript
let assert = require('power-assert')

class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  getAge() {
    return this.age
  }
}

describe("Person", ()=>{
  let alice = new Person("alice", 3)
  let bob = new Person("bob", 5)
  it("#getAge", ()=>{
    assert(alice.getAge() === 3)
  })
  it("#name", ()=>{
    assert(alice.name === "alice")
  })
  // failed
  it("#mistake", ()=>{
    assert(alice.name === bob.name)
  })
})
```

Run mocha with `--compilers js:espower-babel/guess`

```
$ mocha --compilers js:espower-babel/guess test/demo_test.js

  ․․․

  2 passing (17ms)
  1 failing

  1) Person #mistake:
     AssertionError:   # test/demo_test.js:24

  assert(alice.name === bob.name)
         |     |    |   |   |
         |     |    |   |   "bob"
         |     |    |   Person{name:"bob",age:5}
         |     |    false
         |     "alice"
         Person{name:"alice",age:3}

  --- [string] bob.name
  +++ [string] alice.name
  @@ -1,3 +1,5 @@
  -bob
  +alice
```

See the power-assert output appears!


## INSTALL

    $ npm install espower-babel -D


## HOW TO USE

### Zero-config mode(for testing)

If your tests are located on `'test/**/*.js'`, just run mocha with `--compilers js:espower-babel/guess`

    $ mocha --compilers js:espower-babel/guess test/**/*.js


### If your tests are not in test dir

You can set test directory in your `package.json`

```json
{
    "name": "your-module",
    "description": "Your module",
    "version": "0.0.1",
    "directories": {
        "test": "spec/"
    },
...
}
```

Then, run mocha with `--compilers js:espower-babel/guess`

    $ mocha --compilers js:espower-babel/guess spec/**/*.js

Note: `'espower-babel/guess'` is inspired by [intelli-espower-loader](https://github.com/power-assert-js/intelli-espower-loader)


### More customization

If you want to configure more explicitly, put `espower-babel-loader.js` somewhere in your project.

```javascript
require('espower-babel')({
    // directory where match starts with
    cwd: process.cwd(),

    // glob pattern using minimatch module
    pattern: 'spec/unit/**/*.js',

    // options for espower module
    espowerOptions: {
        patterns: [
            'assert(value, [message])',
            'assert.ok(value, [message])',
            'assert.equal(actual, expected, [message])',
            'assert.notEqual(actual, expected, [message])',
            'assert.strictEqual(actual, expected, [message])',
            'assert.notStrictEqual(actual, expected, [message])',
            'assert.deepEqual(actual, expected, [message])',
            'assert.notDeepEqual(actual, expected, [message])'
        ]
    }
});
```

Then, run mocha with `--require` option

    $ mocha --require ./path/to/espower-babel-loader spec/unit/some_test_using_powerassert.js

## Babel transform options

Babel has many transform options.

- [Options · Babel](https://babeljs.io/docs/usage/options/ "Options · Babel")

`espower-babel` support babel transform options with [.babelrc](http://babeljs.io/docs/usage/babelrc/ "babelrc").

`espower-babel` read `${cwd}/.babelrc` if exists.

Also, you can manually configure babel transform options.

e.g.)

```js
require('espower-babel')({
    babelrc: {
        "presets": ["es2015"],
        "plugins": ["transform-es2015-modules-commonjs"]
    }
})
```

**Caution**:
 
Babel 6 does not transform your code by default. 
It means that you must set babel config by `.babelrc` file or `babelrc` option.

### Transform all files with Babel **by default**

Do limit transform files by setting `babelrc`

e.g.)

```js
require('espower-babel')({
    babelrc: {
        only: [
            "src/**/*.js"
        ]
    }
})
```


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT

Includes [yosuke-furukawa/espower-traceur](https://github.com/yosuke-furukawa/espower-traceur "yosuke-furukawa/espower-traceur")

## Acknowledgements

Thanks to [yosuke-furukawa/espower-traceur](https://github.com/yosuke-furukawa/espower-traceur "yosuke-furukawa/espower-traceur").
