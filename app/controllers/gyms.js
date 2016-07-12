import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  actions: {

    //validate input and send ajax request to leaderboard
    validateInput() {

      let name = this.get('username');
      let units = this.get('units');
      let age = parseInt(this.get('age'));
      let weight = parseInt(this.get('weight'));
      let height = parseInt(this.get('height'));
      let bench = parseInt(this.get('benchMax'));
      let squat = parseInt(this.get('squatMax'));
      let deadlift = parseInt(this.get('deadMax'));
      let sex = this.get('sex');

      let errors = false;

      //check each field for errors
      Ember.$('.error').css('visibility', 'hidden');
      if(units == null) {
        Ember.$('#unitsError').css('visibility', 'visible');
        errors = true;
      }
      if(name === undefined) {
        Ember.$('#nameError').css('visibility', 'visible');
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

      if(sex) {
        sex = 'Male';
      }
      else if(!sex) {
        sex = 'Female';
      }

      let addr = this.get('gymAddress');
      let total = bench + squat + deadlift;

      //store everything as pounds
      if(!units) {
        weight *= 2.2;
        bench *= 2.2;
        squat *= 2.2;
        deadlift *= 2.2;
        height *= 0.393701;
      }

      let self = this;
      //get the longitude and latitude from the address using google maps API
      return this.get('ajax').request('/google-gym', {
        method: 'GET',
        data: {
          address: addr
        }
      })
      .then(function(res) {
        //send another request to the leaderboard
        return self.get('ajax').request('/gym-lifts', {
          method: 'POST',
          data: {
            latitude: res.latitude,
            longitude: res.longitude,
            name: name,
            age: age,
            weight: weight.toFixed(2),
            height: height.toFixed(2),
            sex: sex,
            bench: bench.toFixed(2),
            squat: squat.toFixed(2),
            deadlift: deadlift.toFixed(2),
            total: total.toFixed(2)
          }
        })
          .then(function() {
            //update view
            self.set('newGymRecord', false);
            self.send('findGym');
          });
      });
    },
    addGymRecord() {
      //show the add record form
      this.set('newGymRecord', true);
    },
    addGym() {
      //adds a new gym to the database
      let name = this.get('newGymName');
      let addr = this.get('newGymAddress');
      let self = this;
      return this.get('ajax').request('/google-gym', {
        //get the coordinates from google maps
        method: 'GET',
        data: {
          address: addr
        }
      })
      .then(function(res) {
        //put the new gym in the database along with its coordinates
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
          //update the view to say we found the current gym
          self.set('gymNotFound', false);
          self.set('gymFound', false);
          self.set('sucessfullyAdded', true);
        });
      });
    },
    addGymForm() {
      //show the add gym form
      this.set('addGymForm', true);
    },
    findGym() {
      //find a gym from it's address
      let self = this;
      let addr = this.get('gymAddress');

      //make sure the address form is completed
      if(!addr) {
        Ember.$('#addressError').css({'visibility': 'visible'});
        return;
      }

      //if it was, remove the error message
      Ember.$('#addressError').css({'visibility': 'hidden'});

      return this.get('ajax').request('/google-gym', {
        //get coordinates from google maps
        method: 'GET',
        data: {
          address: addr
        }
      })
      .then(function(res) {
        self.latitude = res.latitude;
        self.longitude = res.longitude;
        //try to get a gym associated with this latitude and longitude
        return self.get('ajax').request('/gym', {
          method: 'GET',
          data: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        .then(function(res) {
          let gyms = res.gyms;
          //if gyms exist, take the first one for simplicity
          if(gyms.length > 0) {
            self.set('centerLat', gyms[0].latitude);
            self.set('centerLng', gyms[0].longitude);

            //grab a map image
            self.set('mapURL', 'https://maps.googleapis.com/maps/api/staticmap?'+
            'center=' + gyms[0].latitude +',' + gyms[0].longitude +'&zoom=12&size=400x400&' +
            'maptype=roadmap&key=' + config.KEYS.GOOGLE_MAPS);

            //update view
            self.set('gymNotFound', false);
            self.set('addGymForm', false);
            self.set('gymFound', true);
            self.set('sucessfullyAdded', false);
            self.set('foundGymName', gyms[0].name);
            self.set('foundGymAddress', gyms[0].address);

            //get the lifts for this gym
            return self.get('ajax').request('/gym-lifts', {
              method: 'GET',
              data: {
                latitude: self.latitude,
                longitude: self.longitude
              }
            })
              .then(function(res) {
                self.set('gymRecords', res.gymlift);
              })
                .catch(function(err) {
                  console.log(err);
                });
          }
          //otherwise, add the gym!
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
