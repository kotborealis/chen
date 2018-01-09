const env = require("../").env();

module.exports = {
    user: env['USER'],
    TEST_NUM_ENV: env['TEST_NUM']
}