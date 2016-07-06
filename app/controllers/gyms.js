import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  actions: {
    validateInput() {

      let units = this.get('units');
      let age = parseInt(this.get('age'));
      let weight = parseInt(this.get('weight'));
      let height = parseInt(this.get('height'));
      let bench = parseInt(this.get('benchMax'));
      let squat = parseInt(this.get('squatMax'));
      let deadlift = parseInt(this.get('deadMax'));
      let sex = this.get('sex');

      let errors = false;

      Ember.$('.error').css('visibility', 'hidden');
      if(units == null) {
        Ember.$('#unitsError').css('visibility', 'visible');
        errors = true;
      }
      if(!age) {
        Ember.$('#ageError').css('visibility', 'visible');
        errors = true;
      }
      if(!weight) {
        Ember.$('#weightError').css('visibility', 'visible');
        errors = true;
      }
      if(!height) {
        Ember.$('#heightError').css('visibility', 'visible');
        errors = true;
      }
      if(!bench) {
        Ember.$('#benchError').css('visibility', 'visible');
        errors = true;
      }
      if(!squat) {
        Ember.$('#squatError').css('visibility', 'visible');
        errors = true;
      }
      if(!deadlift) {
        Ember.$('#deadliftError').css('visibility', 'visible');
        errors = true;
      }
      if(sex == null) {
        Ember.$('#sexError').css('visibility', 'visible');
        errors = true;
      }
      if(errors) {
        return;
      }
      let addr = this.get('gymAddress');
      let self = this;
      let total = bench + squat + deadlift;
      return this.get('ajax').request('/google-gym', {
        method: 'GET',
        data: {
          address: addr
        }
      })
      .then(function(res) {
        return self.get('ajax').request('/gym-lifts', {
          method: 'POST',
          data: {
            latitude: res.latitude,
            longitude: res.longitude,
            age: age,
            weight: weight,
            height: height,
            sex: sex,
            bench: bench,
            squat: squat,
            deadlift: deadlift,
            total: total
          }
        });
      });
    },
    addGymRecord() {
      this.set('newGymRecord', true);
    },
    addGym() {
      let name = this.get('newGymName');
      let addr = this.get('newGymAddress');
      let self = this;
      return this.get('ajax').request('/google-gym', {
        method: 'GET',
        data: {
          address: addr
        }
      })
      .then(function(res) {
        return self.get('ajax').request('/gym', {
          method: 'POST',
          data: {
            name: name,
            address: addr,
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
        .then(function() {
          //add validation
          self.set('gymNotFound', false);
          self.set('gymFound', false);
          self.set('sucessfullyAdded', true);
        });
      });
    },
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
        self.latitude = res.latitude;
        self.longitude = res.longitude;
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
            self.set('gymNotFound', false);
            self.set('addGymForm', false);
            self.set('gymFound', true);
            self.set('sucessfullyAdded', false);
            return self.get('ajax').request('/gym-lifts', {
              method: 'GET',
              data: {
                latitude: self.latitude,
                longitude: self.longitude
              }
            })
              .then(function(res) {
                console.log(res.gymlift);
                self.set('gymRecords', res.gymlift);
              })
                .catch(function(err) {
                  console.log(err);
                });
          }
          else {
            self.set('gymFound', false);
            self.set('sucessfullyAdded', false);
            self.set('gymNotFound', true);
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
