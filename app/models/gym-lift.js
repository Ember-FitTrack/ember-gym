import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  latitude: attr('number'),
  longitude: attr('number'),
  name: attr('string'),
  age: attr('number'),
  weight: attr('number'),
  height: attr('number'),
  sex: attr('string'),
  bench: attr('number'),
  squat: attr('number'),
  deadlift: attr('number'),
  total: attr('number')
});
