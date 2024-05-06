import guests from './guest.mjs';

export default new Map([
  ['LeadStates', [
    {id: 1, name: 'pending'},
    {id: 2, name: 'reject'},
    {id: 3, name: 'active'},
    {id: 4, name: 'suspend'},
  ]],
  ['LeadTypes', [
    {id: 1, name: 'guest'},
  ]],
  ['Leads', [
    ...guests.map(it => ({
      id: it.id,
      language: it.language,
      name: it.name,
      contact_type: "email",
      contact: it.contact,
    })),
  ]],
]);