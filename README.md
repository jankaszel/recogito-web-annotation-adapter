# Web Annotation Adapter for RecogitoJS

Proof of concept adapter for connecting the [RecogitoJS annotation library](https://github.com/recogito/recogito-js) to [Web Annotation LDP container storage](https://www.w3.org/TR/annotation-protocol/). This adapter realizes a specification-compliant annotation environment, where users can store their annotations on interoperable LDP resources, decoupled from the annotation application itself.

## Usage

Using [Node.js](https://nodejs.org/), obtain the library via npm:

```sh
npm install recogito-web-annotation-adapter
```

Attaching the adapter to RecogitoJS is straightforward. Complementing a RecogitoJS instance and the annotation container IRI, you will need to provide the adapter with a unique identifier of the annotated resource. The example below uses the [fragment identifier](https://www.w3.org/TR/annotation-model/#fragment-selector) such as `http://www.example.com/#content` to reference the container node's ID within the document:

```js
const content = document.getElementById('annotated-text')
const targetSource = `${window.location}#${content.getAttribute('id')}`
const containerUrl = 'https://annotations.example.com/foo'

recogito = Recogito.init({ content })
annotationAdapter = new WebAnnotationAdapter(recogito, targetSource, containerUrl)
await annotationAdapter.getAnnotations()
```

The library doesn't bear any dependencies at this point, but relies on the well-supported [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). If you target an audience with older browsers, please provide a polyfill for fetch such as [unfetch](https://github.com/developit/unfetch).

[Hyperwell Playground](https://github.com/hyperwell/playground) implements a proof-of-concept annotation environment for annotating the first chapter of Goethe's _Faust_. In this environment, users can supply their own Web Annotation container for annotation storage as well as connect their Hyperwell Notebooks for real-time collaborative editing. [Try it out!](https://playground.hyperwell.org/)

## API

This library exposes two classes, `WebAnnotationAdapter` and `RecogitoAdapter`. They are detailed in the following:

#### `adapter = new WebAnnotationAdapter(recogito, targetSource, containerUrl, opts = {})`

Create a new Web Annotation adapter that connects a RecogitoJS instance to a Web Annotation container for annotation storage and retrieval.

- `recogito`: RecogitoJS instance.
- `targetSource`: IRI identifying the annotated fragment. This could be an IRI like `http://www.example.com/blog#article1`, where `article1` is the ID of the annotated DOM node.
- `containerUrl`: URL of the annotation container that will store annotations.
- Further options in `opts`:
  - `opts.authentication`: _Optional._ Either an object of `{ username: 'name', password: 'pass' }` or a function that will receive request headers of type [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers), modify these accordingly for the purpose of authentication, and return the Headers object.

#### `async adapter.getAnnotations()`

Retrieve all annotations from the specified annotation container and pass them on to the respective RecogitoJS instance.

#### `new RecogitoAdapter(recogito)`

An **abstract interface** for implementing various types of storage adapters for RecogitoJS. `RecogitoAdapter` will wire-up its instance functions to RecogitoJS events—such as `createAnnotation`—and serves as foundation for `WebAnnotationAdapter`.

## LICENSE

MIT
