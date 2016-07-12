import Ember from 'ember';

//used to sort the gym records
export default Ember.Component.extend({
  tagName: 'ul',
  sortedGyms: Ember.computed.sort('gymLifts', 'sortDefinition'),
  sortBy: 'total',
  reverseSort: false,
  sortDefinition: Ember.computed('sortBy', 'reverseSort', function() {
    let sortOrder = this.get('reverseSort') ? 'desc' : 'asc';
    return [ `${this.get('sortBy')}:${sortOrder}` ];
  })
});
