const app = require('./scripts/app.js')
require('./db').sync()
  .then(res => {
    app.init()
  })
  .catch(err => console.log(err))
