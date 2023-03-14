# fluigbind

fluigbind is the espiritual sucessor of Rivets.js, a lightweight data binding and templating system that facilitates building data-driven views. It is agnostic about every aspect of a front-end MV(C|VM|P) stack, making it easy to introduce it into your current workflow or to use it as part of your own custom front-end stack comprised of other libraries.

## Install

```bash
npm install fluigbind
```

Use in a script tag...

```html
<script src="node_modules/fluigbind/dist/fluigbind.js"></script>
```

... or import using a bundler like webpack

```javascript
import fluigbind from 'fluigbind'
```


## Usage

```html
<section id="auction">
  <h3>{ auction.product.name }</h3>
  <p>Current bid: { auction.currentBid | money }</p>

  <aside rv-if="auction.timeLeft | lt 120">
    Hurry up! There is { auction.timeLeft | time } left.
  </aside>
</section>
```

```javascript
fluigbind.bind($('#auction'), {auction: auction})
```

## Getting Started and Documentation

Documentation is available on the [homepage](http://blikblum.github.io/fluigbind/). Learn by reading the [Guide](http://blikblum.github.io/fluigbind/docs/guide/) and refer to the [Binder Reference](http://blikblum.github.io/fluigbind/docs/reference/) to see what binders are available to you out-of-the-box.

## Differences from Rivets.js

* Public interface
  * Uses [web components specs](https://developer.mozilla.org/en-US/docs/Web/Web_Components) instead of custom implementation
  * Implement computed feature using `watch` formatter instead of a specific syntax
  * Add not/negate builtin formatters
  * Remove unless and unchecked binders in favor of combining not/negate formatters with if/checked binders  
  * Add ability to customize input event through event-name attribute
* Internal changes
  * Written in ES6 instead of coffeescript
  * Change how scope of iteration binder works. Instead of copying properties down to children, uses a prototype like approach
    * Related: [486](https://github.com/mikeric/rivets/issues/486) [512](https://github.com/mikeric/rivets/issues/512) [417](https://github.com/mikeric/rivets/pull/417)
    * More info in the [documentation](https://blikblum.github.io/fluigbind/docs/reference/#each-[item])
  * Change name of rv-each index property from index to $index
  * Change how to customize index name in each binder (using an attribute)
    * Related: [551](https://github.com/mikeric/rivets/issues/551) [552](https://github.com/mikeric/rivets/pull/552)
  * Do not bind publish, bind and unbind methods to binding instances
  * Register default binder through fallbackBinder option instead of * binder
  * Integrate sightglass into fluigbind code base
  * Remove view.select method 
  * Rename binding property args to arg and changed type from array to string
  * The rv-* attributes are removed after binding
  * Changes how observer is registered / notified. Instead of passing a function (sync), pass an object with a sync method


## Building and Testing

First install any development dependencies.

```
$ npm install
```

#### Building

fluigbind.js uses rollup as it's bundling / build tool. Run the following  to compile the source into `dist/`.

```
$ npm run build
```

#### Testing

fluigbind.js uses [mocha](http://visionmedia.github.io/mocha/) as it's testing framework, alongside [should](https://github.com/visionmedia/should.js/) for expectations and [sinon](http://sinonjs.org/) for spies, stubs and mocks. Run the following to run the full test suite.

```
$ npm test
```

#### Building documentation

The documentation is built with [harp](http://harpjs.com/) which must be installed globally

```
$ cd docs
$ harp compile _harp ./
```


## Contributing

#### Bug Reporting

1. Ensure the bug can be reproduced on the latest master.
2. Open an issue on GitHub and include an isolated [JSFiddle](http://jsfiddle.net/) demonstration of the bug. The more information you provide, the easier it will be to validate and fix.

#### Pull Requests

1. Fork the repository and create a topic branch.
3. Make sure not to commit any changes under `dist/` as they will surely cause conflicts for others later. Files under `dist/` are only committed when a new build is released.
4. Include tests that cover any changes or additions that you've made.
5. Push your topic branch to your fork and submit a pull request. Include details about the changes as well as a reference to related issue(s).

---
Copyright (c) 2019 Luiz Américo Pereira Câmara <br>
Copyright (c) 2011 Michael Richards