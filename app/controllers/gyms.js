import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  actions: {
    addGymForm() {
      this.set('addGymForm', true);
    },
    findGym() {
      let self = this;
      let addr = this.get('gymAddress');
      if(!addr) {
        Ember.$('#addressError').css({'visibility': 'visible'});
        return;
      }
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
          let gyms = res.gyms;
          if(gyms.length > 0) {
            gotGym(res.gyms);
          }
          else {
            self.set('gymNotFound', true)
            self.set('addGymForm', true);
          }
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
