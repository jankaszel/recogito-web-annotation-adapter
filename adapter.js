class RecogitoAdapter {
  constructor (recogito) {
    this.recogito = recogito

    this.recogito.on('createAnnotation', (annotation, overrideId) =>
      this.createAnnotation(annotation, overrideId)
    )
    this.recogito.on('updateAnnotation', (annotation) =>
      this.updateAnnotation(annotation)
    )
    this.recogito.on('deleteAnnotation', (annotation) =>
      this.deleteAnnotation(annotation)
    )
  }

  async _getAnnotations () {
    throw new TypeError('`adapter.getAnnotations() needs to be implemented.')
  }

  async getAnnotations () {
    this.recogito.setAnnotations(await this._getAnnotations())
  }

  async createAnnotation (annotation, overrideId) {
    throw new TypeError('`adapter.createAnnotation() needs to be implemented.')
  }

  async updateAnnotation (annotation) {
    throw new TypeError('`adapter.updateAnnotation() needs to be implemented.')
  }

  async deleteAnnotation (annotation) {
    throw new TypeError('`adapter.deleteAnnotation() needs to be implemented.')
  }
}

module.exports = RecogitoAdapter
