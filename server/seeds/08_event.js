exports.seed = function(knex) {
    return knex('event').del()
      .then(function () {
        return knex('event').insert([
        {event_name: '2023-08-01-meeting-InterstellarCorp_Office', date: '2020-08-01', location: [15.56500, 102.19000], event_type_id: 1, id_user_data: 1},
        {event_name: '2023-08-02-conference-StarTech_Headquarters', date: '2019-08-02', location: [15.57500, 102.19500], event_type_id: 2, id_user_data: 2},
        {event_name: '2023-08-03-meeting-QuantumDynamics_Facility', date: '2017-08-03', location: [15.58500, 102.20000], event_type_id: 1, id_user_data: 3},
        {event_name: '2023-08-04-conference-GlobalHealthInitiative_Office', date: '2020-08-04', location: [15.59500, 102.20500], event_type_id: 2, id_user_data: 1},
        {event_name: '2023-08-05-joint_training-RoyalThaiArmedForces_Unit1_TrainingFacility', date: '2021-08-05', location: [15.60500, 102.21000], event_type_id: 3, id_user_data: 2},
        {event_name: '2023-08-06-joint_training-RoyalThaiArmedForces_Unit2_MedicalTrainingFacility', date: '2022-08-06', location: [15.61500, 102.21500], event_type_id: 3, id_user_data: 3},
        { event_name: '2019-11-30-meeting-EducationForAllFoundation_Office', date: '2019-11-30', location: [15.63500, 102.22000], event_type_id: 1, id_user_data: 1 },
        { event_name: '2017-06-12-conference-InterstellarCorp_Facility', date: '2017-06-12', location: [15.69500, 102.23500], event_type_id: 2, id_user_data: 2 },
        { event_name: '2022-09-22-meeting-StarTech_Headquarters', date: '2022-09-22', location: [15.75500, 102.25000], event_type_id: 1, id_user_data: 3 },
        { event_name: '2018-02-07-joint_training-RoyalThaiArmedForces_Unit1_Office', date: '2018-02-07', location: [15.81500, 102.26500], event_type_id: 3, id_user_data: 1 },
        { event_name: '2021-12-19-meeting-QuantumDynamics_Headquarters', date: '2021-12-19', location: [15.87500, 102.28000], event_type_id: 1, id_user_data: 2 },
        { event_name: '2020-03-23-joint_training-RoyalThaiArmedForces_Unit2_TrainingFacility', date: '2020-03-23', location: [15.93500, 102.29500], event_type_id: 3, id_user_data: 3 },
        { event_name: '2017-07-14-conference-GlobalHealthInitiative_Facility', date: '2017-07-14', location: [15.99500, 102.31000], event_type_id: 2, id_user_data: 1 },
        { event_name: '2021-06-05-meeting-InterstellarCorp_Headquarters', date: '2021-06-05', location: [16.05500, 102.32500], event_type_id: 1, id_user_data: 2 },
        { event_name: '2018-08-18-joint_training-RoyalThaiArmedForces_Unit1_MedicalTrainingFacility', date: '2018-08-18', location: [16.11500, 102.34000], event_type_id: 3, id_user_data: 3 },
        { event_name: '2019-01-01-conference-GlobalHealthInitiative_Office', date: '2019-01-01', location: [16.17500, 102.35500], event_type_id: 2, id_user_data: 1 }
        ]);
      })
      .then(function(){
        return knex.raw("SELECT setval('event_id_seq', (SELECT MAX(id) from event))");
    });
  }
  const eventsData = [
  
];

const eventsWithoutId = eventsData.map(({ id, ...rest }) => rest);

console.log(eventsWithoutId);
