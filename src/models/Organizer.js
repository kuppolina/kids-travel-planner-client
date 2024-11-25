class Organizer {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.password = null;
    this.token = null;
    this.notes = null;
    this.tasks = null;
    this.image = null;
    Object.assign(this, data);
  }
}

export default Organizer;
