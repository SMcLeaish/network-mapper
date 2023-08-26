/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('user_data').del()
        .then(function() {
            // Inserts seed entries
            return knex('user_data').insert([
                {
                    username: 'joe.schmoe.mil@mail.mil',
                    hashed_password: '5f4dcc3b5aa765d61d8327deb882cf99', // password
                    user_organization: 'Army-1st_Brigade_82nd_Airborne',
                    distinguished_name: 'CN=Joe Schmoe,OU=USA,O=DoD,C=US,DODID=1234567890',
                    cac_approved: true,
                },
                {
                    username: 'jane.doe.af@mail.mil',
                    hashed_password: '5f4dcc3b5aa765d61d8327deb882cf99', // password
                    user_organization: 'Airforce-99th_Wing',
                    distinguished_name: 'CN=Jane Doe,OU=USA,O=DoD,C=US,DODID=2345678901',
                    cac_approved: true,
                },
                {
                    username: 'john.doe.af@mail.mil',
                    hashed_password: '5f4dcc3b5aa765d61d8327deb882cf99', // password
                    user_organization: 'Airforce-57th_Wing',
                    distinguished_name: 'CN=John Doe,OU=USA,O=DoD,C=US,DODID=3456789012',
                    cac_approved: true,
                },
                {
                    username: 'mark.milley@mail.mil',
                    hashed_password: '5f4dcc3b5aa765d61d8327deb882cf99', // password
                    user_organization: 'Navy-Seal_Team_Six',
                    distinguished_name: 'CN=Mark Military,OU=USA,O=DoD,C=US,DODID=4567890123',
                    cac_approved: true,
                },
                {
                    username: 'mary.mariner@mail.mil',
                    hashed_password: '5f4dcc3b5aa765d61d8327deb882cf99', // password
                    user_organization: 'MarineCorps-1st_Marine_Division',
                    distinguished_name: 'CN=Mary Marine,OU=USA,O=DoD,C=US,DODID=5678901234',
                    cac_approved: true,
                },
            ]);
        })
        .then(function(){
            return knex.raw("SELECT setval('user_data_id_seq', (SELECT MAX(id) from user_data))");
        });
}
