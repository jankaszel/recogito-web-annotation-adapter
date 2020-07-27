# Web Annotation Adapter for RecogitoJS

Proof of concept adapter for connecting the [RecogitoJS annotation library](https://github.com/recogito/recogito-js) to [Web Annotation LDP container storage](https://www.w3.org/TR/annotation-protocol/). This adapter realizes a specification-compliant annotation environment, where users can store their annotations on interoperable LDP resources, decoupled from the annotation application itself.

This repository contains a fully-fledged example for annotating the first chapter of Goethe's _Faust_ in an experimental annotation environment, where users can provide their own Web Annotation container for annotation storage. Run it via `cd ./example && npm install && npm run dev`. More instructions on running a personal annotation server will follow.

## API

This library exposes two classes, `WebAnnotationAdapter` and `RecogitoAdapter`. These are detailed in the following.

#### `adapter = new WebAnnotationAdapter(recogito, targetSource, containerUrl, opts = {})`

Create a new Web Annotation adapter that connects a RecogitoJS instance to a Web Annotation container for annotation storage and retrieval.

- `recogito`: RecogitoJS instance.
- `targetSource`: IRI identifying the annotated fragment. This could be an IRI like `http://www.example.com/blog#article1`, where `article1` is the ID of the annotated DOM node.
- `containerUrl`: URL of the annotation container that will store annotations.
- Further options in `opts`:
  - `opts.authentication`: _Optional._ Either an object of `{ username: 'albrecht', password: 'duerer' }` or a function that will receive request headers of type [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers), modify these accordingly for the purpose of authentication, and return the Headers object.

#### `adapter.getAnnotations()`

Retrieve all annotations from the specified annotation container and pass them on to the respective RecogitoJS instance.

#### `new RecogitoAdapter(recogito)`

An **abstract interface** for implementing various types of storage adapters for RecogitoJS. `RecogitoAdapter` will wire-up its instance functions to RecogitoJS events, such as `createAnnotation` and serves as foundation for `WebAnnotationAdapter`.

## LICENSE

MIT

