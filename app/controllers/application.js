import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    calculateLifts() {
      this.toggleProperty('isCalculated');
      let bench = parseInt(this.get('benchMax'));
      let squat = parseInt(this.get('squatMax'));
      let deadlift = parseInt(this.get('deadMax'));
      this.set('liftTotal', bench+squat+deadlift);

      let weight = parseInt(this.get('weight'));

      //all classifications estimated through exrx
      //http://www.exrx.net/Testing/WeightLifting/StrengthStandards.html
      if(bench < 0.75*weight)
        this.set('benchClass', 'Untrained');
      else if(bench >= 0.75*weight && bench < weight)
        this.set('benchClass', 'Novice');
      else if(bench >= weight && bench < 1.25*weight)
        this.set('benchClass', 'Intermediate');
      else if(bench >= 1.25*weight && bench < 2*weight)
        this.set('benchClass', 'Advanced');
      else if(bench >= 2*weight)
        this.set('benchClass', 'Elite');
      else
        this.set('benchClass', 'Unknown');

      if(squat < weight)
        this.set('squatClass', 'Untrained');
      else if(squat >= weight && squat < weight*1.5)
        this.set('squatClass', 'Novice');
      else if(squat >= weight*1.5 && squat < weight*2)
        this.set('squatClass', 'Intermediate');
      else if(squat >= 2*weight && squat < 2.5*weight)
        this.set('squatClass', 'Advanced');
      else if(squat >= 2.5*weight)
        this.set('squatClass', 'Elite');
      else
        this.set('squatClass', 'Unknown');

      if(deadlift < weight)
        this.set('deadClass', 'Untrained');
      else if(deadlift >= weight && deadlift < weight*1.5)
        this.set('deadClass', 'Novice');
      else if(deadlift >= weight*1.5 && deadlift < weight*2)
        this.set('deadClass', 'Intermediate');
      else if(deadlift >= 2*weight && deadlift < 2.5*weight)
        this.set('deadClass', 'Advanced');
      else if(deadlift >= 2.5*weight)
        this.set('deadClass', 'Elite');
      else
        this.set('deadClass', 'Unknown');

    }
  }
});
