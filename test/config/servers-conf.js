'use strict';

var tmp = 'tmp',
    tmpAbsolutePath = require('path').join(process.cwd(), tmp);

var DEFAULT_PORTS = {
  express: 23455,
  mongo: 23456,
  redis: 23457,
  ldap: 23458,
  elasticsearch: 23459,
  elasticsearch_comm: 23460,
  davserver: 23461,
  rabbitmq: 23462
};

var images = require('../../docker/images.json');
var host = process.env.HOSTNAME || process.env.DOCKER_HOST || 'localhost';
var mongoHost = process.env.MONGO_HOST || process.env.HOSTNAME || process.env.DOCKER_HOST || 'localhost';
var mongoPort = process.env.MONGO_PORT || DEFAULT_PORTS.mongo;
var amqpHost = process.env.AMQP_HOST || process.env.HOSTNAME || process.env.DOCKER_HOST || 'localhost';
var amqpPort = process.env.AMQP_PORT || DEFAULT_PORTS.rabbitmq;
var elasticsearchHost = process.env.ELASTICSEARCH_HOST || process.env.HOSTNAME || process.env.DOCKER_HOST || 'localhost';
var elasticsearchPort = process.env.ELASTICSEARCH_PORT || DEFAULT_PORTS.elasticsearch;
var redisHost = process.env.REDIS_HOST || process.env.HOSTNAME || process.env.DOCKER_HOST || 'localhost';
var redisPort = process.env.REDIS_PORT || DEFAULT_PORTS.redis;
var dbName = 'tests';

module.exports = {
  tmp: tmp,

  default_ports: DEFAULT_PORTS,

  host: host,

  express: {
    port: process.env.PORT_EXPRESS || DEFAULT_PORTS.express
  },

  mongodb: {
    cmd: process.env.CMD_MONGODB || 'mongod',
    port: mongoPort,
    interval_replica_set: process.env.MONGODB_INTERVAL_REPLICA_SET || 1000,
    tries_replica_set: process.env.MONGODB_TRIES_REPLICA_SET || 20,
    host: mongoHost,
    connectionString: 'mongodb://' + mongoHost + ':' + mongoPort + '/' + dbName,
    replicat_set_name: 'rs',
    dbname: dbName,
    dbpath: tmp + '/mongo/',
    logpath: '',
    elasticsearch: {},
    container: {
      image: images.mongodb,
      name: 'mongo_for_esn_test'
    }
  },

  redis: {
    cmd: process.env.CMD_REDIS || 'redis-server',
    port: redisPort,
    host: redisHost,
    conf_file: '',
    log_path: '',
    pwd: '',
    container: {
      image: images.redis,
      name: 'redis_for_esn_test'
    }
  },

  rabbitmq: {
    cmd: process.env.CMD_RABBITMQ ||
      'RABBITMQ_NODENAME=esn_test ' +
      `RABBITMQ_NODE_PORT=${amqpPort} ` +
      `RABBITMQ_MNESIA_BASE=${tmpAbsolutePath}/rabbitmq-mnesia ` +
      `RABBITMQ_LOG_BASE=${tmpAbsolutePath}/rabbitmq-logs ` +
      'rabbitmq-server',
    port: amqpPort,
    url: 'amqp://' + amqpHost + ':' + amqpPort,
    container: {
      image: images.rabbitmq,
      name: 'rabbitmq_for_esn_test'
    }
  },

  ldap: {
    cmd: 'node ./test/inmemory-ldap.js',
    port: process.env.PORT_LDAP || DEFAULT_PORTS.ldap,
    suffix: 'o=rse',
    ldapadmin: 'cn=root',
    pwd: 'secret'
  },

  elasticsearch: {
    cmd: process.env.CMD_ELASTICSEARCH || 'elasticsearch',
    port: elasticsearchPort,
    host: elasticsearchHost,
    communication_port: process.env.COMMUNICATION_PORT_ELASTICSEARCH || DEFAULT_PORTS.elasticsearch_comm,
    interval_index: process.env.ELASTICSEARCH_INTERVAL_INDEX || 1000,
    tries_index: process.env.ELASTICSEARCH_TRIES_INDEX || 20,
    cluster_name: 'elasticsearch',
    data_path: tmp + '/elasticsearch/data',
    work_path: tmp + '/elasticsearch/work',
    logs_path: tmp + '/elasticsearch/logs',
    container: {
      image: images.elasticsearch,
      name: 'elasticsearch_for_esn_test'
    }
  },

  davserver: {
    port: process.env.PORT_DAVSERVER || DEFAULT_PORTS.davserver
  }
};
