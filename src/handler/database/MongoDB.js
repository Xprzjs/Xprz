/**
 * Class representing a MongoDB database connection manager.
 */
class MongoDB {
  /**
   * Create a MongoDB instance.
   * @param {object} pkg - The MongoDB package.
   */
  constructor(pkg) {
    /** @private */
    this.mongodb = pkg;
    /** @private */
    this.mongoClient = null;
    /** @private */
    this.db = null;

    // Bind all methods to the instance
    this.connect = this.connect.bind(this);
    this.getMongoDb = this.getMongoDb.bind(this);
    this.getClient = this.getClient.bind(this);
    this.getDb = this.getDb.bind(this);
    this.find = this.find.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.close = this.close.bind(this);
  }

  /**
   * Connect to the MongoDB database.
   * @param {string} uri - The MongoDB connection URI.
   * @param {object} options - Additional connection options.
   * @param {boolean} [log=true] - Whether to log connection status.
   * @param {string} [textLog="MongoDB Connected"] - The text to log when connection is successful.
   * @example
   * const uri = 'mongodb://localhost:27017/mydatabase';
   * await mongodb.connect(uri);
   */
  async connect(uri,options = { useUnifiedTopology: true },log = true, textLog = "MongoDB Connected") {
    try {
      this.mongoClient = await this.mongodb.MongoClient.connect(uri, options);
      this.db = this.mongoClient.db();
      if (log) {
        console.log(textLog);
      }
      return this.mongoClient;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get the MongoDB package.
   * @returns {object} The MongoDB package.
   * @example
   * const mongodb = new MongoDB(require('mongodb'));
   * const mongoPackage = mongodb.getMongoDb();
   */
  getMongoDb() {
    return this.mongodb;
  }

  /**
   * Get the current MongoDB client.
   * @returns {object} The MongoDB client.
   * @example
   * const client = mongodb.getClient();
   */
  getClient() {
    return this.client;
  }

  /**
   * Get the current MongoDB database.
   * @returns {object} The MongoDB database.
   * @example
   * const db = mongodb.getDb();
   */
  getDb() {
    return this.db;
  }

  /**
   * Perform a find operation on a MongoDB collection.
   * @param {string} collectionName - The name of the collection.
   * @param {object} query - The query criteria.
   * @param {object} options - Additional options.
   * @returns {Promise} A promise that resolves with the query results.
   * @example
   * const users = await mongodb.find('users', { age: { $gt: 18 } });
   */
  async find(collectionName, query, options = {}) {
    const collection = this.db.collection(collectionName);
    const result = await collection.find(query, options).toArray();
    return result;
  }

  /**
   * Perform an insert operation on a MongoDB collection.
   * @param {string} collectionName - The name of the collection.
   * @param {object} document - The document to insert.
   * @param {object} options - Additional options.
   * @returns {Promise} A promise that resolves with the inserted document.
   * @example
   * const newUser = await mongodb.insert('users', { name: 'John', age: 30 });
   */
  async insert(collectionName, document, options = {}) {
    const collection = this.db.collection(collectionName);
    const result = await collection.insertOne(document, options);
    return result.ops[0];
  }

  /**
   * Perform an update operation on a MongoDB collection.
   * @param {string} collectionName - The name of the collection.
   * @param {object} filter - The filter criteria.
   * @param {object} update - The update object.
   * @param {object} options - Additional options.
   * @returns {Promise} A promise that resolves with the update result.
   * @example
   * await mongodb.update('users', { name: 'John' }, { $set: { age: 35 } });
   */
  async update(collectionName, filter, update, options = {}) {
    const collection = this.db.collection(collectionName);
    const result = await collection.updateOne(filter, update, options);
    return result;
  }

  /**
   * Perform a delete operation on a MongoDB collection.
   * @param {string} collectionName - The name of the collection.
   * @param {object} filter - The filter criteria.
   * @param {object} options - Additional options.
   * @returns {Promise} A promise that resolves with the delete result.
   * @example
   * await mongodb.delete('users', { name: 'John' });
   */
  async delete(collectionName, filter, options = {}) {
    const collection = this.db.collection(collectionName);
    const result = await collection.deleteOne(filter, options);
    return result;
  }

  /**
   * Close the MongoDB connection.
   * @param {boolean} [force=false] - Whether to force close the connection.
   * @param {boolean} [log=true] - Whether to log disconnection status.
   * @param {string} [textLog="MongoDB connection closed"] - The text to log when connection is closed.
   * @example
   * mongodb.close();
   */
  close(force = false, log = true, textLog = "MongoDB connection closed") {
    if (this.client) {
      this.client.close(force);
      this.client = null;
      if (log) {
        console.log(textLog);
      }
    }
  }
}
module.exports = MongoDB;
