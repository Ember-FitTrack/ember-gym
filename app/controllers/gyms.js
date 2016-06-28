import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  actions: {
    findGym() {
      let self = this;
      let addr = this.get('gymAddress');
      return this.get('ajax').request('/google-gym', {
        method: 'GET',
        data: {
          address: addr
        }
      })
      .then(function(res) {
        self.set('latitude', res.latitude);
        self.set('longitude', res.longitude);
      })
      .catch(function(err) {
        console.log(err);
      });

    }
  }
});
