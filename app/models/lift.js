import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  age: attr('number'),
  weight: attr('number'),
  height: attr('number'),
  male: attr('boolean'),
  bench: attr('number'),
  squat: attr('number'),
  deadlift: attr('number'),
  total: attr('number')
});
