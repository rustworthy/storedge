import { type Redis, type RedisConfigNodejs } from '@upstash/redis';

type DurableObject = any;
type Key = string;

interface DurablesPutValueOpts {
  key?: Key;
}

interface Durables {
  put: (value: DurableObject, opts?: DurablesPutValueOpts) => Promise<Key>;
  get: (key: Key) => Promise<DurableObject>;
}

interface StorEdgeOpts {
  config?: RedisConfigNodejs;
  envFile?: string;
}

declare class StorEdge {
  constructor(opts?: StorEdgeOpts);
  KV: Redis;
  Durables: Durables;
}

export = StorEdge;
