#!/bin/bash

bin/ycsb load mysqljson -P workloads/workloada -cp mysql-connector-j-8.1.0.jar -p db.driver=com.mysql.cj.jdbc.Driver -p db.url=jdbc:mysql://localhost:3307/test -p db.user=root -p db.passwd=root -threads 2 -p recordcount=1000 -p operationcount=1000
bin/ycsb run mysqljson -P workloads/workloada -cp mysql-connector-j-8.1.0.jar -p db.driver=com.mysql.cj.jdbc.Driver -p db.url=jdbc:mysql://localhost:3307/test -p db.user=root -p db.passwd=root -threads 2 -p recordcount=1000 -p operationcount=1000

bin/ycsb load pgjsonb -P workloads/workloada -cp postgresql-42.6.0.jar -p db.driver=org.postgresql.Driver -p db.url=jdbc:postgresql://localhost:5433/test -p db.user=test -p db.passwd=test -threads 2 -p recordcount=1000 -p operationcount=1000
bin/ycsb run pgjsonb -P workloads/workloada -cp postgresql-42.6.0.jar -p db.driver=org.postgresql.Driver -p db.url=jdbc:postgresql://localhost:5433/test -p db.user=test -p db.passwd=test -threads 2 -p recordcount=1000 -p operationcount=1000

bin/ycsb load mongodb -s -P workloads/workloada -p mongodb.url="mongodb://root:test@localhost:27018" -threads 2 -p recordcount=1000 -p operationcount=1000 -p document_depth=0
bin/ycsb run mongodb -s -P workloads/workloada -p mongodb.url="mongodb://root:test@localhost:27018" -threads 2 -p recordcount=1000 -p operationcount=1000
