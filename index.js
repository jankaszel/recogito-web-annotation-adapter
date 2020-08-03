const RecogitoAdapter = require('./adapter')

function wrapAuthentication (authentication) {
  if (
    typeof authentication === 'object' &&
    authentication.username &&
    authentication.password
  ) {
    return (headers) => {
      headers.append(
        'Authorization',
        `Basic ${btoa(`${authentication.username}:${authentication.password}`)}`
      )
      return headers
    }
  } else if (typeof authentication === 'function') {
    return authentication
  } else {
    return null
  }
}

class WebAnnotationAdapter extends RecogitoAdapter {
  constructor (recogito, targetSource, containerUrl, opts = {}) {
    super(recogito)

    this.targetSource = targetSource
    this.containerUrl = containerUrl
    this.authentication = wrapAuthentication(opts.authentication)
  }

  async _fetch (url, opts = {}) {
    const _headers = new Headers(opts.headers || {})
    const headers = this.authentication
      ? this.authentication(_headers)
      : _headers

    return fetch(url, {
      ...opts,
      credentials: this.authentication ? 'include' : 'same-origin',
      headers,
    })
  }

  async _getAnnotations () {
    const containerRes = await this._fetch(this.containerUrl, {
      headers: {
        'accept': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'
      }
    })
    const container = await containerRes.json()
    if (!container.first) {
      return []
    }

    let collection = []
    let nextPage = container.first
    do {
      const pageRes = await this._fetch(nextPage, {
        headers: {
          'accept': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'
        }
      })
      const page = await pageRes.json()
      collection = collection.concat(page.items)
      nextPage = page.next
    } while (nextPage)

    return collection
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
