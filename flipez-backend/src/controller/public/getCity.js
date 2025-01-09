const fs = require('fs');

const getCity = async (req) => {
    try {
        const rawData = fs.readFileSync(__dirname + '/../../json/cities.json');
        const cities = JSON.parse(rawData);
        return req.sendResponse(200, cities.filter((city) => city.state_code == req.params.stateCode));
    } catch (err) {
        return req.sendResponse(500, err);
    }
};

module.exports = getCity;