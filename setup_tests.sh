#!/bin/bash

# get ycsb fork
git clone https://github.com/artemiuss/YCSB
cd YCSB

# build ycsb from source
mvn -pl site.ycsb:core -am clean package
mvn -pl site.ycsb:binding-parent -am clean package
mvn -pl site.ycsb:distribution -am clean package
mvn -pl site.ycsb:mongodb-binding -am clean package
mvn -pl site.ycsb:pgjsonb-binding -am clean package
mvn -pl site.ycsb:mysqljson-binding -am clean package

# get mysql jdbc driver
curl -O --location https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-j-8.1.0.tar.gz
tar xfvz mysql-connector-j-8.1.0.tar.gz
mv mysql-connector-j-8.1.0/mysql-connector-j-8.1.0.jar .
rm -r mysql-connector-j-8.1.0.tar.gz mysql-connector-j-8.1.0

# get postgresql jdbc driver
curl -O --location https://jdbc.postgresql.org/download/postgresql-42.6.0.jar

