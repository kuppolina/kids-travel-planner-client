class Participant {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.age = null;
    this.dateOfBirth = null;
    this.address = null;
    this.image = null;
    this.notes = null;
    Object.assign(this, data);
  }
}

export default Participant;
