# Redis Cluster Configuration

Slipstream provides a mechanism to use Redis client where data is sharded across multiple Redis server nodes. 

# workflow

Slipstream preference route loads Redis-client configuration from slipstream/config.js file. 
Slipstream will run redis client in cluster mode if redis_cluster object is configured. Else it requires redis_port and redis_host paramater to connect to standalone redis-server node.

# Configuration example

```

module.exports = {
	"redis_port": '6379',
	"redis_host": '127.0.0.1'
}

```

For above configuration, Redis client will operate in normal mode. It will connect the Redis server node at 
127.0.0.1: 6379.

```

module.exports = {
	"redis_cluster": {
		"servers": [
			{
				host: 'localhost',
				port: 30001
			},
			{
				host: 'localhost',
				port: 30002
			}
		]
	}
}

```

For above configuration, Redis client will operate in cluster mode. It will treat each specified server as master. The servers will be automatically connected via cluster slots. There must be atleast one server specified in configuration in order to allow discovery.

### Cluster configuration with additional options:

#### slotInterval 
Interval to repeatedly re-fetch cluster slot configuration. Default is set to zero.

#### wait
Max time to wait for connecting to cluster before sending an error to all getSlots callbacks. Default: no timeout.

#### slaves
Strategy to direct readonly commands like 'get'.
set the value to 'never' for using masters only, 'share' to distribute between masters and slaves, 
'always' to  only use slaves (if available). Default is set to 'never'.

Example cluster configuration with additional options.

```

module.exports = {

	"redis_cluster": {
		 slotInterval: 1000, 
		 wait: 5000,
		 slaves: 'share',
		"servers": [
			{
				host: 'localhost',
				port: 30001
			},
			{
				host: 'localhost',
				port: 30002
			}
		]
	}
}

```

NOTE: redis_cluster configuration gets the priority if 'redis_port' and 'redis_host' are defined along with 'redis_cluster' in config.js file.

