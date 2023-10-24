'use strict';

const assert = require('node:assert');
const { describe, it, after, before } = require('node:test');

const { BSON, ObjectId } = require('bson');

const StorEdge = require('./storedge.js');

describe('StorEdge client connection', () => {
  it('should fail if env file not found', async () => {
    const client = new StorEdge({ envFile: 'afasf2324e12rqc' });
    const error = await client.connect();
    const noSuchFile = `ENOENT: no such file or directory, open 'afasf2324e12rqc'`;
    assert.equal(error.message, noSuchFile);
  });

  it('should fail if invalid endpoint', async () => {
    after(function cleanUp() {
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
    });
    const envFile = 'afasf232__&&csdsr123#4e12rqc';
    const client = new StorEdge({ envFile });
    const error = await client.connect();
    const msg = `ENOENT: no such file or directory, open '${envFile}'`;
    assert.equal(error.message, msg);
  });

  it('succeeds if valid creds in dot-env file', async () => {
    const client = new StorEdge({ envFile: '.env' });
    const err = await client.connect();
    assert.equal(err, null);
  });

  it('succeeds if valid creds loaded to execution environment', async () => {
    const client = new StorEdge();
    const err = await client.connect();
    assert.equal(err, null);
  });
});

describe('StorEdge KV for primitive cases', () => {
  let client1, client2;
  before(async () => {
    client1 = new StorEdge({ envFile: '.env' });
    client2 = new StorEdge();
    await Promise.all([client1.connect(), client2.connect()]);
  });

  it('client2 can get a primitive after clien1 set it', async () => {
    const key = 'testPrimitiveCase';
    const value = 123;
    const status = await client1.KV.set(key, value);
    assert.equal(status, 'OK');
    const resultKV = await client2.KV.get(key);
    assert.equal(resultKV, value);
  });
});

describe('StorEdge Durables for primitive cases', () => {
  let client1, client2;
  before(async () => {
    client1 = new StorEdge({ envFile: '.env' });
    client2 = new StorEdge();
    await Promise.all([client1.connect(), client2.connect()]);
  });

  it('client2 can get a primitive after clien1 set it', async () => {
    const key = 'testObjectCase_Durables';
    const value = {
      _id: new ObjectId(),
      name: 'Paul Michelle',
      patterns: [/^Miche/g, /^Pa/i, /^Mi/g],
      age: 42,
      born: new Date(1979, 3, 21),
      likes: ['food', 'movies', 'sports'],
      contact: {
        email: 'email@address.io',
        phone: '555-555-5555',
      },
      visited: true,
      reviews: null,
      secretKey: BSON.serialize({ key: new ObjectId() }).toString(),
      backUpKey1: new Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]).toString('base64'),
      backUpKey2: '\x01\x02\x03\x04\x05\x06\x07\x08',
      location: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [3, 6],
            [6, 1],
            [0, 0],
          ],
          [
            [2, 2],
            [3, 3],
            [4, 2],
            [2, 2],
          ],
        ],
      },
    };

    const id = await client1.Durables.put(value, { key });
    assert.equal(id, key);

    const resultDurables = await client2.Durables.get(id);
    assert.deepStrictEqual(resultDurables, value);
  });
});
