const fetch = require('node-fetch')
const RecogitoAdapter = require('./adapter')
const Headers = fetch.Headers

async function fetchAnnotations (containerUrl) {
  const container = await (await fetch(containerUrl)).json()
  if (!container.first) {
    return []
  }

  let collection = []
  let nextPage = container.first
  do {
    const page = await (await fetch(nextPage)).json()
    collection = collection.concat(page.items)
    nextPage = page.next
  } while (nextPage)

  return collection
}

class WebAnnotationAdapter extends RecogitoAdapter {
  constructor (recogito, targetSource, containerUrl, opts = {}) {
    super(recogito)

    this.targetSource = targetSource
    this.containerUrl = containerUrl

    if (
      typeof opts.authentication === 'object' &&
      authentication.username &&
      authentication.password
    ) {
      this.authentication = () => {
        headers.append(
          'authorization',
          btoa(`Basic ${authentication.username}:${authentication.password}`)
        )
        return headers
      }
    } else if (typeof opts.authentication === 'function') {
      this.authentication = opts.authentication
    } else {
      this.authentication = null
    }
  }

  async _fetch (url, opts) {
    const _headers = new Headers(opts.headers || {})
    const headers = this.authentication
      ? this.authentication(_headers)
      : _headers

    return fetch(url, {
      ...opts,
      headers,
    })
  }

  async _getAnnotations () {
    return await fetchAnnotations(this.containerUrl)
  }

  async createAnnotation (annotation, overrideId) {
    const rawAnnotation = { ...annotation }
    if (annotation.id) {
      delete rawAnnotation.id
    }
    rawAnnotation.target.source = this.targetSource

    await this._fetch(this.containerUrl, {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"',
      },
      redirect: 'follow',
      body: JSON.stringify(rawAnnotation),
    })
  }

  async updateAnnotation (annotation) {
    await this._fetch(annotation.id, {
      method: 'PUT',
      headers: {
        'Content-Type':
          'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"',
      },
      redirect: 'follow',
      body: JSON.stringify(annotation),
    })
  }

  async deleteAnnotation (annotation) {
    await this._fetch(annotation.id, {
      method: 'delete',
    })
  }
}

module.exports = { RecogitoAdapter, WebAnnotationAdapter }
