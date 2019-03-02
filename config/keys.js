// keys js
if (process.env.NODE_ENV === 'production') {
	// we are in production
	module.exports = require('./prod');
} else {
	// we are in dev mode
	module.exports = require('./dev');
}
