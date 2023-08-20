#!/usr/bin/env python3
from matplotlib import pyplot as plt

db_list = [
    {"name":"PostgreSQL", "alias":"postgresql"},
    {"name":"MySQL", "alias":"mysql"},
    {"name":"MongoDB", "alias":"mongodb"}
]

workload_list = [
    {"name":"Workload A: Update heavy workload", "alias":"workloada"},
    {"name":"Workload B: Read mostly workload", "alias":"workloadb"},
    {"name":"Workload C: Read only", "alias":"workloadc"}
]

for workload in workload_list:
    report_file_name = f'report_{workload["alias"]}'

    threads = list(range(0, 100))
    throughput = list(range(100, 200))
    latency99 = list(range(0, 100))

    plt.subplot(2, 1, 1)
    plt.title(f'Throughput and 99th Percentile Latency\n depending on number of threads')
    for db in db_list:
        plt.plot(threads, throughput, label = db["name"])
    plt.ylabel('Throughput, ops/sec')
    plt.legend()

    plt.subplot(2, 1, 2)
    for db in db_list:
        plt.plot(threads, latency99, label = db["name"])
    plt.ylabel('99th Percentile Latency, us')
    plt.xlabel('Threads, number')
    plt.legend()

    plt.savefig(f"report_output/{report_file_name}.png")
