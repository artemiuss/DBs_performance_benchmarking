#!/bin/bash

set -eu

#EXPERIMENTS=3
#RECORDCOUNT=1000000
#OPERATIONCOUNT=1000000
#declare -a THREADS=(1 10 20 30 40 50 60 70 80 90 100)

EXPERIMENTS=1
RECORDCOUNT=1000
OPERATIONCOUNT=100
declare -a THREADS=(1)

WORKLOAD=$1
YCSB_HOME="YCSB"
DTIME_FORMAT="%Y-%m-%d-%H-%M-%S"
DATE_TS="$(date +"${DTIME_FORMAT}")"

for THREAD in "${THREADS[@]}"
do
    echo "Run experiments for ${THREAD} threads"

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

        # set benchmark params
        YCSB_PARAMS=(-p "${RECORDCOUNT}"=1000 -p "${OPERATIONCOUNT}"=100 -threads "${THREAD}")

        # create result dir
        RESULT_DIR="../${WORKLOAD}_threads_${THREAD}_${DATE_TS}"
        mkdir "${RESULT_DIR}"
        
        #run mysql benchmark
        DB="mysql"
        bin/ycsb load mysqljson -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" \
            -cp mysql-connector-j-8.1.0.jar \
            -p db.driver=com.mysql.cj.jdbc.Driver \
            -p db.url=jdbc:mysql://localhost:3307/test -p db.user=root -p db.passwd=root \
            > "${RESULT_DIR}/load_${DB}"

        bin/ycsb run mysqljson -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" \
            -cp mysql-connector-j-8.1.0.jar \
            -p db.driver=com.mysql.cj.jdbc.Driver \
            -p db.url=jdbc:mysql://localhost:3307/test -p db.user=root -p db.passwd=root \
            > "${RESULT_DIR}/run_${DB}"

        #run pg benchmark
        DB="postgresql"
        bin/ycsb load pgjsonb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" \
            -cp postgresql-42.6.0.jar \
            -p db.driver=org.postgresql.Driver \
            -p db.url=jdbc:postgresql://localhost:5433/test -p db.user=test -p db.passwd=test \
            > "${RESULT_DIR}/load_${DB}"

        bin/ycsb run pgjsonb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" \
            -cp postgresql-42.6.0.jar \
            -p db.driver=org.postgresql.Driver \
            -p db.url=jdbc:postgresql://localhost:5433/test -p db.user=test -p db.passwd=test \
            > "${RESULT_DIR}/run_${DB}"

        #run mongo benchmark
        DB="mongodb"
        bin/ycsb load mongodb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" \
            -p mongodb.url="mongodb://root:test@localhost:27018" -p mongodb.auth="true" \
            > "${RESULT_DIR}/load_${DB}"

        bin/ycsb run mongodb -P "workloads/${WORKLOAD}" "${YCSB_PARAMS[@]}" \
            -p mongodb.url="mongodb://root:test@localhost:27018" -p mongodb.auth="true" \
            > "${RESULT_DIR}/run_${DB}"
        
        cd ..

        # stop containers
        docker compose down
        sleep 1
    done
done
