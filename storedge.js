'use strict';

const { Redis } = require('@upstash/redis');
const { BSON, EJSON, ObjectId } = require('bson');

const Durables = (store) => {
  const serialize = (root) => {
    return BSON.serialize(root);
  };

  const deserialize = (root) => {
    if (root === null) return null;
    if (typeof root === 'string') {
      return EJSON.parse(root);
    }
    if (root.type === 'Buffer' && Array.isArray(root.data)) {
      const byteArray = Uint8Array.from(root.data);
      return BSON.deserialize(byteArray);
    }
    return root;
  };

  const put = async (value, opts = { key: null }) => {
    const k = opts.key ?? new ObjectId();
    const v = serialize(value);
    await store.set(k, v);
    return k;
  };

  const get = async (key) => {
    const cached = await store.get(key);
    const v = deserialize(cached);
    return v;
  };

  return { put, get };
};

class StorEdge {
  static parseOpts(opts) {
    if (opts.config) return { fromEnv: false, config: opts.config };
    const fromEnvFile = typeof opts.envFile === 'string';
    if (fromEnvFile) {
      const { error } = require('dotenv').config({ path: opts.envFile });
      if (error) throw new Error(error.message);
    }
    return { fromEnv: true, config: null };
  }

  async connect() {
    let redis, reply;
    try {
      const { fromEnv, config } = StorEdge.parseOpts(this.opts);
      redis = fromEnv ? Redis.fromEnv() : new Redis(config);
      reply = await redis.ping();
    } catch (error) {
      return new Error(error.message);
    }
    if (reply !== 'PONG') return new Error('Redis connection failed');
    this.KV = redis;
    this.Durables = Durables(redis);
    return null;
  }

  constructor(opts = { config: null, envFile: null }) {
    this.opts = opts;
    this.KV = null;
    this.Durables = null;
  }
}

module.exports = StorEdge;
module.exports.StorEdge = StorEdge;
module.exports.default = StorEdge;
