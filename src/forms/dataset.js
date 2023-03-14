
class Dataset {

  constructor(datasetName) {
    this.datasetName = datasetName;
  }


  async load() {
    const datasetName = this.datasetName
    if (!datasetName) {
      throw new Error(`No dataset declared for ${this.name}`)
    }

    const filterFields = [];
    const constraints = this.constraints
    if (constraints) {
      Object.keys(constraints).forEach(field => {
        const value = constraints[field]
        filterFields.push(field);
        filterFields.push(value);
      })
    }

    let content = await [];

    return content;
  }

}

export default Dataset