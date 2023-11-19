const fs = require('fs');
const path = require('path');

module.exports = (image) => {
    if (image) {
        const imagePath = path.join('public', image);
    
        fs.rm(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
    }
}