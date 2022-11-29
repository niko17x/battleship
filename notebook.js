const personActions = {
  getFullName() {
    return this.firstName + this.lastName;
  },
};

const createPerson = (firstName, lastName) => {
  const person = Object.create(personActions);
  person.firstName = firstName;
  person.lastName = lastName;

  return person;
};

const person = createPerson("zoe", "gray");
console.log(person.getFullName());
