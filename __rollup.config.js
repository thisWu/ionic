var path = require( 'path' );

function myPlugin() {
  return {
    resolveId (importee, importer) {
      if (importee.indexOf('@angular/') === 0) {
        importee = __dirname + '/node_modules/' + importee + '/index.js'
        console.log(importee)
        return importee;
      }

      if (importee.indexOf('rxjs/') === 0) {
        importee = __dirname + '/node_modules/' + importee.replace('rxjs/', 'rxjs-es/') + '.js'
        console.log(importee)
        return importee;
      }
      return null;
    }
  };
}

export default {
  entry: './__entry.js',
  plugins: [myPlugin()]
};