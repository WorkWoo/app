// Log
var log = {
  info: function(content) {
    console.log('Info -> ' + content)
  },
  error: function(content) {
    console.log('Error -> ' + content);
  },
  object: function(givenObject) {
    for(var property in givenObject) {
      console.log('Key   -> ' + property);
      console.log('Value -> ' + givenObject[property]);
    }
  }
}