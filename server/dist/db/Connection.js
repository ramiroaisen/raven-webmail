"use strict";
/*
import { MongoClient, Db, Collection } from "mongodb";
import { config } from "../config";

let client: Promise<MongoClient> | null = null;
export const getConnection = async (): Promise<MongoClient> => {
  if (client == null) {
    client = MongoClient.connect(config.mongodb_url);
  }
  return client;
}

let db: Promise<Db> | null = null;
export const getDatabase = async (): Promise<Db> => {
  if(db == null) {
    db = getConnection().then(conn => conn.db());
  }
  return db;
}

export const CollectionGetter = <T>(name: string) => {
  let collection: Promise<Collection<T>> | null = null;
  return () => {
    if(collection == null) {
      collection = getDatabase().then(db => db.collection<T>(name));
    }
    return collection;
  }
}
*/
//# sourceMappingURL=Connection.js.map