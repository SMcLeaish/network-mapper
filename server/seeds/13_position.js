exports.seed = function(knex) {
    return knex('position').del()
      .then(function () {
        const individuals = Array.from({length: 10}, (_, i) => i + 1);
        const roles = Array.from({length: 10}, (_, i) => i + 1);
        const militaryRoles = [1, 2, 10];
        const otherRoles = roles.filter(role => !militaryRoles.includes(role));
        return knex('organization_type').select('id', 'type')
          .then(organizations => {
            const militaryOrganizations = organizations.filter(org => org.type === 3).map(org => org.id);
            const otherOrganizations = organizations.filter(org => org.type !== 3).map(org => org.id);
            const positions = individuals.map(individual => {
              const isMilitary = Math.random() < 0.5;  
              return {
                individual_id: individual,
                role_id: isMilitary ? getRandom(militaryRoles) : getRandom(otherRoles),
                organization_id: isMilitary ? getRandom(militaryOrganizations) : getRandom(otherOrganizations),
              }
            });
  
            return knex('position').insert(positions);
          });
      });
  };
  
  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }