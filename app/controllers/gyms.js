import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  actions: {
    findGym() {
      let self = this;
      let addr = this.get('gymAddress');
      console.log('address: ' + addr);
      return this.get('ajax').request('/google-gym', {
        method: 'GET',
        data: {
          address: addr
        }
      })
      .then(function(res) {
        self.set('latitude', res.latitude);
        self.set('longitude', res.longitude);
        return self.get('ajax').request('/gym', {
          method: 'GET',
          data: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        .then(function(res) {
          console.log('exists?');
          console.log(res);
        })
        .catch(function(err) {
          console.log(err);
        });
      })
      .catch(function(err) {
        console.log(err);
      });

    }
  }
});
