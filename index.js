const RecogitoAdapter = require('./adapter')

class WebAnnotationAdapter extends RecogitoAdapter {
  constructor (recogito, targetSource, containerUrl, opts = {}) {
    super(recogito)

    this.targetSource = targetSource
    this.containerUrl = containerUrl

    if (
      typeof opts.authentication === 'object' &&
      opts.authentication.username &&
      opts.authentication.password
    ) {
      this.authentication = (headers) => {
        headers.append(
          'Authorization',
          `Basic ${btoa(
            `${opts.authentication.username}:${opts.authentication.password}`
          )}`
        )
        return headers
      }
    } else if (typeof opts.authentication === 'function') {
      this.authentication = opts.authentication
    } else {
      this.authentication = null
    }
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
    const container = await (await this._fetch(this.containerUrl)).json()
    if (!container.first) {
      return []
    }

    let collection = []
    let nextPage = container.first
    do {
      const page = await (await this._fetch(nextPage)).json()
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
