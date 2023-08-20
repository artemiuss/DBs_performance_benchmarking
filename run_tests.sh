#!/bin/bash

set -eu

RECORDCOUNT=10000
OPERATIONCOUNT=10000
declare -a WORKLOADS=("workloada" "workloadb" "workloadc")
declare -a THREADS=(1 2 4 8 10 20 30 40 50 60 70 80 90 100)
YCSB_HOME="YCSB"

for WORKLOAD in "${WORKLOADS[@]}"
do
    for THREAD in "${THREADS[@]}"
    do
        echo "Run benchmark for ${THREAD} threads"

        # start containers
        docker compose up -d

        # wait for containers to start
        sleep 60

        # create structures
        mysql --host="127.0.0.1" --port="3307" --user="root" -proot test < mysql_init.sql
        export PGPASSWORD="test"; psql -h "127.0.0.1" -p 5433 -d test -U test < pg_init.sql

        cd "${YCSB_HOME}"

        # set benchmark params
        YCSB_PARAMS=(-p recordcount="${RECORDCOUNT}" -p operationcount="${OPERATIONCOUNT}" -threads "${THREAD}")

        # create result dir
        RESULT_DIR="../benchmark_results/${WORKLOAD}_threads_${THREAD}"
        mkdir -p "${RESULT_DIR}"

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
