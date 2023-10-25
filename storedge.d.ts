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

type BuildResult = [Error | null, StorEdge | null];
declare class StorEdge {
  constructor(opts?: StorEdgeOpts);
  public static with(opts?: StorEdgeOpts): StorEdge;
  public static build(opts?: StorEdgeOpts): BuildResult;
  public static buildWithPing(opts?: StorEdgeOpts): Promise<BuildResult>;
  build(): BuildResult;
  buildWithPing(): Promise<BuildResult>;
  KV: Redis;
  Durables: Durables;
}

export = StorEdge;
