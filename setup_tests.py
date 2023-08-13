#!/usr/bin/env python3
import psycopg2
import mysql.connector
from pymongo import MongoClient

def setup_pg():
    conn = psycopg2.connect(host = "localhost", port = 5433, database = "test", user = "test", password = "test")
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS test;")
    cur.execute("CREATE TABLE test (id SERIAL NOT NULL PRIMARY KEY, json_doc JSONB NOT NULL);")
    conn.commit()
    cur.close()
    conn.close()

def setup_mysql():
    cnx = mysql.connector.connect(host = "localhost", port = 3307, database = "test", user = "test", password = "test")
    cur = cnx.cursor()
    cur.execute("DROP TABLE IF EXISTS test;")
    cur.execute("CREATE TABLE test (id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY, json_doc JSON NOT NULL);")
    cnx.commit()
    cur.close()
    cnx.close()

def setup_mongo():
    client = MongoClient('mongodb://localhost:27018/')
    db = client['test']
    collection = db['test']

def main():
    setup_pg()
    setup_mysql()
    setup_mongo()

if __name__ == '__main__':
    main()