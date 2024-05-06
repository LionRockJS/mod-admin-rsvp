const list = [
  ["John Doe","john@example.com",""],
]

const guests = list.map((x, i) => ({
  id: 1000+i,
  language: "en",
  salutation: "",
  name: x[0],
  last_name: "",
  contact: x[1],
  cc:x[2]
}));

export default guests;