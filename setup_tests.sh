#!/bin/bash

# create structures
mysql --host="127.0.0.1" --port="3307" --user="root" -proot test < mysql_init.sql
export PGPASSWORD="test"; psql -h "127.0.0.1" -p 5433 -d test -U test < pg_init.sql

# get ycsb fork
git clone -b jdbc-native-json-update-with-separate-id https://github.com/artemiuss/YCSB
cd YCSB

# build ycsb from source
mvn -pl com.yahoo.ycsb:mysqljson-binding -am clean package
mvn -pl com.yahoo.ycsb:pgjsonb-binding -am clean package
mvn -pl com.yahoo.ycsb:mongodb-binding -am clean package

# fix shebang
sed -i 's/#!\/usr\/bin\/env python/#!\/usr\/bin\/env python2/g' bin/ycsb

# get mysql jdbc driver
curl -O --location https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-j-8.1.0.tar.gz
tar xfvz mysql-connector-j-8.1.0.tar.gz
mv mysql-connector-j-8.1.0/mysql-connector-j-8.1.0.jar .
rm -r mysql-connector-j-8.1.0.tar.gz mysql-connector-j-8.1.0

# get postgresql jdbc driver
curl -O --location https://jdbc.postgresql.org/download/postgresql-42.6.0.jar



