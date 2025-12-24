const axios = require('axios');
axios
    .get('https://swapi.py4e.com/api/people/')
    .then(result => { console.log(result.data); })
    .then(result => { process.exit; })
    .catch(error => { console.error('Error fetching data:', error); });