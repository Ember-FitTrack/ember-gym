import Ember from 'ember';

const untrainedRGB = [51, 193, 255]; //light blie
const noviceRGB = [15, 8, 130]; //dark blue
const intermediateRGB = [52, 255, 40]; //light greenv
const advancedRGB = [13, 109, 7]; //dark green
const eliteRGB = [250, 71, 71]; //light red
const unknownRGB = [255, 255, 255]; //white

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),
  actions: {
    sendRequest() {
      let age = parseInt(this.get('age'));
      let weight = parseInt(this.get('weight'));
      let height = parseInt(this.get('height'));
      let bench = parseInt(this.get('benchMax'));
      let squat = parseInt(this.get('squatMax'));
      let deadlift = parseInt(this.get('deadMax'));
      let total = bench + squat + deadlift;
      let sex = this.get('sex');
      sex = (sex===true ? 'Male' : 'Female');
      return this.get('ajax').request('/lifts', {
        method: 'POST',
        data: {
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
    },
    calculateLifts() {
      //if validate input TODO
      this.set('isCalculated', true);
      let bench = parseInt(this.get('benchMax'));
      let squat = parseInt(this.get('squatMax'));
      let deadlift = parseInt(this.get('deadMax'));
      this.set('liftTotal', bench+squat+deadlift);

      let sex = this.get('sex');
      sex = (sex===true ? 'Male' : 'Female');
      this.set('sex', sex);

      let weight = parseInt(this.get('weight'));

      //used for color coding body diagram
      let benchRate, squatRate, deadRate;
      let benchColor, squatColor, deadColor;
      //all classifications estimated through exrx
      //http://www.exrx.net/Testing/WeightLifting/StrengthStandards.html
      if(bench < 0.75*weight) {
        benchRate = 'Untrained';
        benchColor = untrainedRGB;
      }
      else if(bench >= 0.75*weight && bench < weight) {
        benchRate = 'Novice';
        benchColor = noviceRGB;
      }
      else if(bench >= weight && bench < 1.25*weight) {
        benchRate = 'Intermediate';
        benchColor = intermediateRGB;
      }
      else if(bench >= 1.25*weight && bench < 2*weight) {
        benchRate = 'Advanced';
        benchColor = advancedRGB;
      }
      else if(bench >= 2*weight) {
        benchRate = 'Elite';
        benchColor = eliteRGB;
      }
      else {
        benchRate = 'Unknown';
        benchColor = unknownRGB;
      }
      this.set('benchClass', benchRate);

      if(squat < weight) {
        squatRate = 'Untrained';
        squatColor = untrainedRGB;
      }
      else if(squat >= weight && squat < weight*1.5) {
        squatRate = 'Novice';
        squatColor = noviceRGB;
      }
      else if(squat >= weight*1.5 && squat < weight*2) {
        squatRate = 'Intermediate';
        squatColor = intermediateRGB;
      }
      else if(squat >= 2*weight && squat < 2.5*weight) {
        squatRate = 'Advanced';
        squatColor = advancedRGB;
      }
      else if(squat >= 2.5*weight) {
        squatRate = 'Elite';
        squatColor = eliteRGB;
      }
      else {
        squatRate = 'Unknown';
        squatColor = unknownRGB;
      }
      this.set('squatClass', squatRate);

      if(deadlift < weight) {
        deadRate = 'Untrained';
        deadColor = untrainedRGB;
      }
      else if(deadlift >= weight && deadlift < weight*1.5) {
        deadRate = 'Novice';
        deadColor = noviceRGB;
      }
      else if(deadlift >= weight*1.5 && deadlift < weight*2) {
        deadRate = 'Intermediate';
        deadColor = intermediateRGB;
      }
      else if(deadlift >= 2*weight && deadlift < 2.5*weight) {
        deadRate = 'Advanced';
        deadColor = advancedRGB;
      }
      else if(deadlift >= 2.5*weight) {
        deadRate = 'Elite';
        deadColor = eliteRGB;
      }
      else {
        deadRate = 'Unknown';
        deadColor = unknownRGB;
      }
      this.set('deadClass', deadRate);

        //Wilks
        //for men, TODO women, gotta be a better way than this
        //oh, it's also incorrect TOFIX
      let weightKG = weight/2.2;
      let wilks = (bench+squat+deadlift) / (-216.0475144 + weightKG*16.2606339 +
        weightKG*weightKG*-0.002388645 + weightKG*weightKG*weightKG*-0.00113732 +
        weightKG*weightKG*weightKG*weightKG*0.00000701863 +
        weightKG*weightKG*weightKG*weightKG*weightKG*-0.00000001291);
        this.set('wilks', wilks);

      let canvas = document.getElementById("canvas");
      let ctx = canvas.getContext("2d");

      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = draw;
      img.src = 'muscleMale.png';

      this.send('sendRequest');

      function draw() {
        //set body graph


        ctx.drawImage(img, 0, 0);
        console.log("image drawn");

        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imgData.data;

        let red, green, blue, alpha;
        for(let i = 0; i < data.length; i+=4) {
          red = data[i+0];
          green = data[i+1];
          blue = data[i+2];
          alpha = data[i+3];

          if(red > 200 && green < 100 && blue < 100) {
            //bench muscles
            data[i] = benchColor[0];
            data[i+1] = benchColor[1];
            data[i+2] = benchColor[2];

          }

          else if(red < 100 && green < 50 && blue > 200) {
            //dl muscles
            data[i] = deadColor[0];
            data[i+1] = deadColor[1];
            data[i+2] = deadColor[2];
          }

          else if(red < 100 && green > 200 && blue < 100) {
            //squat muscles
            data[i] = squatColor[0];
            data[i+1] = squatColor[1];
            data[i+2] = squatColor[2];
          }


        }

        ctx.putImageData(imgData, 0, 0);
      }
    }
  }
});
