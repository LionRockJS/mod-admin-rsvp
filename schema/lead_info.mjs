import guests from './guest.mjs';

export default new Map([
  ['LeadInfos', [
    ...guests.map(it => ({
      id: it.id,
      last_name: it.last_name,
      cc: it.cc,
      salutation: it.salutation,
    })),
  ]],
]);