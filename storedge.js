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
  static with(opts = { config: null, envFile: null }) {
    return new StorEdge(opts);
  }

  static build(opts = { config: null, envFile: null }) {
    const storedge = new StorEdge(opts);
    return storedge.build();
  }

  static async buildWithPing(opts = { config: null, envFile: null }) {
    const storedge = new StorEdge(opts);
    const result = await storedge.buildWithPing();
    return result;
  }

  constructor(opts = { config: null, envFile: null }) {
    this.opts = opts;
    this.KV = null;
    this.Durables = null;
  }

  static parseOpts(opts) {
    if (opts.config) return { fromEnv: false, config: opts.config };
    const fromEnvFile = typeof opts.envFile === 'string';
    if (fromEnvFile) {
      const { error } = require('dotenv').config({ path: opts.envFile });
      if (error) throw new Error(error.message);
    }
    return { fromEnv: true, config: null };
  }

  configure(client) {
    this.KV = client;
    this.Durables = Durables(client);
    return this;
  }

  /** @returns {[?Error, StorEdge]} */
  build() {
    let redis;
    try {
      const { fromEnv, config } = StorEdge.parseOpts(this.opts);
      redis = fromEnv ? Redis.fromEnv() : new Redis(config);
    } catch (error) {
      return [new Error(error.message), null];
    }
    this.configure(redis);
    return [null, this];
  }

  async buildWithPing() {
    const [error, store] = this.build();
    if (error) return [error, null];
    let reply;
    try {
      reply = await store.KV.ping();
    } catch (error) {
      return [new Error(error.message), null];
    }
    return reply === 'PONG' ? [null, store] : [new Error('ping failed'), null];
  }
}

module.exports = StorEdge;
module.exports.StorEdge = StorEdge;
module.exports.default = StorEdge;
