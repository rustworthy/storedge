# StorEdge

## KV & Durable objects for serverless environments with Redis (Upstash HTTP API) and BSON serialization

![example workflow](https://github.com/rustworthy/storedge/actions/workflows/general.yml/badge.svg)

### Usage

After installation (e.g.L with `npm i storedge`), import the library:

```js
// commonjs
const storedge = require('storedge');
// esm
import * as storedge from 'storedge';
```

Now, assuming environment variables ('UPSTASH_REDIS_REST_URL' and 'UPSTASH_REDIS_REST_TOKEN') are alread loaded,
you can simply do:

```js
const storedge = require('storedge');

const [error, store] = storedge.build();
if (error) return console.error(error);

// or in many cases:
// if (error) {
//  logger.error(error.message);
//  return new Response('It's embarassing, but something went wrong :(', { status: 500 });
// }

const myObject = {
  id: '11251225122512',
  name: 'Paul Michelle',
  patterns: [/^Miche/g, /^Pa/i, /^Mi/g],
  born: new Date(1979, 3, 21),
  likes: ['food', 'movies', 'sports'],
  contact: {
    email: 'email@address.io',
    phone: '555-555-5555',
  },
};

const key = await store.Durables.put(myObject, { key: '11251225122512' });
const restored = await store.Durables.get(key);

// or if you want the libary to issue an objectId for your object,
// you can omit the opts parameter:
const objectId = await store.Durables.put(myObject);
const restored = await store.Durables.get(objectId);
```

If you want the library to load the variables from a dotenv file:

```js
const storedge = require('storedge');
const [error, store] = storedge.with({ envFile: '.env.local' }).build();
```

If you want the library to check that the Redis deployment is responsive and
your creds are just fine, you can go with:

```js
const storedge = require('storedge');
const [error, store] = await storedge
  .with({ envFile: '.env.local' })
  .buildWithPing();
```

Finally, if you want to pass redis deployment url and token directly, you can do so with:

```js
const storedge = require('storedge');

// with literals...
const [error, store] = await storedge
  .with({ config: { url: 'https://***.io', token: 'AX95***NGY=' } })
  .build();

// ...or with refs to env vars:
const [error, store] = await storedge
  .with({
    config: {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
  })
  .build();
```

All the Upstash HTTP Api methods are available in the store.KV namespace,
and are documented in the [Upstash HTTP API docs](https://upstash.com/docs/redis/features/restapi).

```js
const storedge = require('storedge');

const [error, store] = storedge.with({ envFile: '.env' }).build();
if (error) return console.error(error);

const myPrimitive = 101;
const result = await store.KV.set('key001', myPrimitive);
if (result !== 'OK') return console.error('Failed to store myPrimitive');
const restored = await store.KV.get('key001');
```

### Contributing

Please see [CONTRIBUTING](./CONTRIBUTING.md) and [CODE_OF_CONDUCT](./CODE_OF_CONDUCT.md).

1. Fork this repo and clone to your workstation
2. Run `npm i`
3. Run `npm run prepare` to setup husky git hooks
4. Run `npm run check` to run linter and tests
5. Commit your changes, push to your fork and open a PR
