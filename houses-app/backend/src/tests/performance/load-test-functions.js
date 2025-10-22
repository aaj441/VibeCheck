// Helper functions for Artillery load tests

module.exports = {
  generateAuthToken: function(context, events, done) {
    // In a real test, this would make an actual login request
    // For now, we'll simulate a token
    context.vars.token = 'test-jwt-token-' + Date.now();
    return done();
  },
  
  $randomEmail: function() {
    return `test${Date.now()}@example.com`;
  },
  
  $randomUsername: function() {
    return `user${Date.now()}`;
  },
  
  $randomPassword: function() {
    return `Pass${Date.now()}!`;
  },
  
  $randomHouse: function() {
    const houses = ['logic', 'creation', 'chaos', 'observation'];
    return houses[Math.floor(Math.random() * houses.length)];
  },
  
  $randomString: function() {
    return Math.random().toString(36).substring(7);
  }
};