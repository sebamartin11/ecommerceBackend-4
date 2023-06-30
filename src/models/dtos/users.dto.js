class CurrentUserDTO {
  constructor(payload) {
    this.firstName = payload.first_name;
    this.lastName = payload.last_name;
    this.fullName = `${payload.first_name} ${payload.last_name || ""}`.trim();
    this.email = payload.email;
    this.role = payload.role;
  }
}

module.exports = { CurrentUserDTO };
