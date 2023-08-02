exports.seed = function(knex) {
  return knex('event').del()
    .then(function () {
      return knex('event').insert([
      {event_name: '2023-08-01-meeting-InterstellarCorp_Office', date: '2020-08-01', location: [7.8848, 98.4009], event_type_id: 1, id_user_data: 1},
      {event_name: '2023-08-02-conference-StarTech_Headquarters', date: '2019-08-02', location: [19.9072, 99.8309], event_type_id: 2, id_user_data: 2},
      {event_name: '2023-08-03-meeting-QuantumDynamics_Facility', date: '2017-08-03', location: [13.109, 101.21], event_type_id: 1, id_user_data: 3},
      {event_name: '2023-08-04-conference-GlobalHealthInitiative_Office', date: '2020-08-04', location: [12.6685, 101.2818], event_type_id: 2, id_user_data: 1},
      {event_name: '2023-08-05-joint_training-RoyalThaiArmedForces_Unit1_TrainingFacility', date: '2021-08-05', location: [18.7999, 98.9726], event_type_id: 3, id_user_data: 2},
      {event_name: '2023-08-06-joint_training-RoyalThaiArmedForces_Unit2_MedicalTrainingFacility', date: '2022-08-06', location: [7.8839, 98.3906], event_type_id: 3, id_user_data: 3},
      { event_name: '2019-11-30-meeting-EducationForAllFoundation_Office', date: '2019-11-30', location: [13.4357, 101.1327], event_type_id: 1, id_user_data: 1 },
      { event_name: '2017-06-12-conference-InterstellarCorp_Facility', date: '2017-06-12', location: [14.0181, 99.5320], event_type_id: 2, id_user_data: 2 },
      { event_name: '2022-09-22-meeting-StarTech_Headquarters', date: '2022-09-22', location: [7.6243, 100.0746], event_type_id: 1, id_user_data: 3 },
      { event_name: '2018-02-07-joint_training-RoyalThaiArmedForces_Unit1_Office', date: '2018-02-07', location: [8.0373, 99.5536], event_type_id: 3, id_user_data: 1 },
      { event_name: '2021-12-19-meeting-QuantumDynamics_Headquarters', date: '2021-12-19', location: [12.4818, 102.0345], event_type_id: 1, id_user_data: 2 },
      { event_name: '2020-03-23-joint_training-RoyalThaiArmedForces_Unit2_TrainingFacility', date: '2020-03-23', location: [18.7674, 98.9773], event_type_id: 3, id_user_data: 3 },
      { event_name: '2017-07-14-conference-GlobalHealthInitiative_Facility', date: '2017-07-14', location: [7.3204, 100.1492], event_type_id: 2, id_user_data: 1 },
      { event_name: '2021-06-05-meeting-InterstellarCorp_Headquarters', date: '2021-06-05', location: [13.5127, 99.9541], event_type_id: 1, id_user_data: 2 },
      { event_name: '2018-08-18-joint_training-RoyalThaiArmedForces_Unit1_MedicalTrainingFacility', date: '2018-08-18', location:[14.9359,100], event_type_id: 3, id_user_data: 3 },
      { event_name: '2019-01-01-conference-GlobalHealthInitiative_Office', date: '2019-01-01', location: [13.7279, 100.5241], event_type_id: 2, id_user_data: 1 }
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