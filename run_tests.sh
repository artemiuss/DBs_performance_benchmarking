#!/bin/bash

set -eu

#EXPERIMENTS=3
#declare -a THREADS=(1 10 20 30 40 50 60 70 80 90 100)
#YCSB_PARAMS=(-p recordcount=1000000 -p operationcount=1000000)
EXPERIMENTS=1
declare -a THREADS=(1)
YCSB_PARAMS=(-p recordcount=1000 -p operationcount=100)
WORKLOAD=$1
YCSB_HOME="YCSB"

for thread in "${THREADS[@]}"
do
    echo "Run experiments for ${thread} threads"

    for i in $(seq 1 $EXPERIMENTS)
    do
        echo "Run ${i} experiment"
        
        # start containers
        docker compose up -d

        # wait for containers to start
        sleep 60

        # create structures
        mysql --host="127.0.0.1" --port="3307" --user="root" -proot test < mysql_init.sql
        export PGPASSWORD="test"; psql -h "127.0.0.1" -p 5433 -d test -U test < pg_init.sql

        cd "${YCSB_HOME}"

        #run mysql benchmark
        bin/ycsb load mysqljson -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -cp mysql-connector-j-8.1.0.jar -p db.driver=com.mysql.cj.jdbc.Driver -p db.url=jdbc:mysql://localhost:3307/test -p db.user=root -p db.passwd=root
        bin/ycsb run mysqljson -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -cp mysql-connector-j-8.1.0.jar -p db.driver=com.mysql.cj.jdbc.Driver -p db.url=jdbc:mysql://localhost:3307/test -p db.user=root -p db.passwd=root

        #run pg benchmark
        bin/ycsb load pgjsonb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -cp postgresql-42.6.0.jar -p db.driver=org.postgresql.Driver -p db.url=jdbc:postgresql://localhost:5433/test -p db.user=test -p db.passwd=test
        bin/ycsb run pgjsonb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -cp postgresql-42.6.0.jar -p db.driver=org.postgresql.Driver -p db.url=jdbc:postgresql://localhost:5433/test -p db.user=test -p db.passwd=test

        #run mongo benchmark
        bin/ycsb load mongodb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -p mongodb.url="mongodb://root:test@localhost:27018" -p mongodb.auth="true"
        bin/ycsb run mongodb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" -p mongodb.url="mongodb://root:test@localhost:27018" -p mongodb.auth="true"
        
        cd ..

        # stop containers
        docker compose down
        sleep 1
    done
done
