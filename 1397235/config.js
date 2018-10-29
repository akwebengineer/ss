var path = require('path');

module.exports = {
	"installed_plugins_path" : path.join(path.dirname(require.main.filename), "public", "installed_plugins"),
	"redis_port": '6379',
	"redis_host": 'localhost',
	"app_port": '3000'

	// Uncomment this to use redis-client in cluster mode.

	// "redis_cluster": {
	// 	 slotInterval: 1000, 
	// 	 wait: 5000, 
	// 	 slaves: 'share',
	// 	"servers": [
	// 		{
	// 			host: 'localhost',
	// 			port: 30001
	// 		},
	// 		{
	// 			host: 'localhost',
	// 			port: 30002
	// 		},
	// 		{
	// 			host: 'localhost',
	// 			port: 30003
	// 		}
	// 	],
	// }
}

