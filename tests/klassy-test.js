import { Klass, defineClass, extendClass } from 'klassy';

module("Klassy", {});

test("`defineClass` can create a new base class with properties and methods", function() {
  var Planet = defineClass(null, {
    name: 'TBD',
    greeting: function() {
      return 'hello from ' + this.name;
    }
  });

  var earth = new Planet();
  equal(earth.name, 'TBD', 'property comes from class prototype');
  equal(earth.greeting(), 'hello from TBD', 'functions come from class prototype');

  earth.name = 'earth';
  equal(earth.greeting(), 'hello from earth', 'functions are evaluated in proper context');
});

test("`defineClass` can create a new subclass with properties and methods", function() {
  var CelestialObject = defineClass(null, {
    name: 'TBD',
    greeting: function() {
      return 'hello from ' + this.name;
    }
  });
  var Planet = defineClass(CelestialObject, {
    greeting: function() {
      return this._super() + '!';
    }
  }, {
    isPlanet: true
  });

  var earth = new Planet();
  equal(earth.name, 'TBD', 'property comes from superclass');
  equal(earth.greeting(), 'hello from TBD!', 'functions come from class prototype');
  equal(earth.isPlanet, true, 'property comes from mixin');

  earth.name = 'earth';
  equal(earth.greeting(), 'hello from earth!', 'functions are evaluated in proper context');
});

test("`extendClass` makes _super accessible within overridden methods", function() {
  var Planet = defineClass(null, {
    name: 'TBD',
    greeting: function() {
      return 'hello from ' + this.name;
    },
    abc: function() {
      return 'a';
    }
  });

  extendClass(Planet.prototype, {
    greeting: function() {
      return this._super() + '!';
    },
    abc: function() {
      if (this._super) {
        return 'b';
      } else {
        return 'c';
      }
    }
  }, {
    isPlanet: true
  });

  var earth = new Planet();
  equal(earth.name, 'TBD', 'property comes from superclass');
  equal(earth.greeting(), 'hello from TBD!', 'functions can access _super');
  equal(earth.abc(), 'b', 'functions are wrapped and have _super injected');
  equal(earth.abc.wrappedFunction(), 'c', 'wrapped functions are still accessible');
  equal(earth.isPlanet, true, 'property comes from mixin');

  earth.name = 'earth';
  equal(earth.greeting(), 'hello from earth!', 'functions are evaluated in proper context');
});

test("`Klass` can be extended to easily define and subclass classes", function() {
  var CelestialObject = Klass.extend({
    name: 'TBD',
    init: function(name) {
      this._super.apply(this, arguments);
      this.name = name;
      this.isCelestialObject = true;
    },
    greeting: function() {
      return 'Hello from ' + this.name;
    }
  });
  var Planet = CelestialObject.extend({
    init: function(name) {
      this._super.apply(this, arguments);
      this.isPlanet = true;
    }
  }, {
    greeting: function() {
      return this._super() + '!';
    },
  });

  var earth = new Planet('Earth');

  ok(earth instanceof Object);
  ok(earth instanceof Klass);
  ok(earth instanceof CelestialObject);
  ok(earth instanceof Planet);

  equal(earth.name, 'Earth', 'property set by constructor');
  equal(earth.greeting(), 'Hello from Earth!', 'greeting function is composed from mixin and superclass');
  equal(earth.isCelestialObject, true, 'property comes from CelestialObject.init');
  equal(earth.isPlanet, true, 'property comes from Planet.init');

  earth.name = 'Jupiter';
  equal(earth.greeting(), 'Hello from Jupiter!', 'functions are evaluated in proper context');
});
