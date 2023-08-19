#!/bin/bash

set -eu

EXPERIMENTS=3
declare -a THREADS=(1 10 20 30 40 50 60 70 80 90 100)
WORKLOAD=$1
YCSB_PARAMS=(-p recordcount=1000000 -p operationcount=1000000)

for thread in "${THREADS[@]}"
do
    echo "Run experiments for ${thread} threads"

    for i in $(seq 1 $EXPERIMENTS)
    do
        echo "Run ${i} experiment"
        
        #docker compose up -d

        #mysql
        bin/ycsb load mysqljson -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -cp mysql-connector-j-8.1.0.jar -p db.driver=com.mysql.cj.jdbc.Driver -p db.url=jdbc:mysql://localhost:3307/test -p db.user=root -p db.passwd=root
        bin/ycsb run mysqljson -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -cp mysql-connector-j-8.1.0.jar -p db.driver=com.mysql.cj.jdbc.Driver -p db.url=jdbc:mysql://localhost:3307/test -p db.user=root -p db.passwd=root

        #pg
        bin/ycsb load pgjsonb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -cp postgresql-42.6.0.jar -p db.driver=org.postgresql.Driver -p db.url=jdbc:postgresql://localhost:5433/test -p db.user=test -p db.passwd=test
        bin/ycsb run pgjsonb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -cp postgresql-42.6.0.jar -p db.driver=org.postgresql.Driver -p db.url=jdbc:postgresql://localhost:5433/test -p db.user=test -p db.passwd=test

        #mongo
        bin/ycsb load mongodb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -p mongodb.url="mongodb://root:test@localhost:27018" -p mongodb.auth="true"
        bin/ycsb run mongodb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -p mongodb.url="mongodb://root:test@localhost:27018" -p mongodb.auth="true"

        #docker compose down
        sleep 1
    done
done
