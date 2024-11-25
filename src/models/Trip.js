class Trip {
  constructor(data = {}) {
    this.id = null;
    this.title = null;
    this.status = null;
    this.address = null;
    this.organizerId = null;
    this.description = null;
    this.image = null;
    this.numberOfKids = null;
    Object.assign(this, data);
  }
}

export default Trip;
