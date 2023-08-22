#!/usr/bin/env python3
import re
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

thread_list = [1,2,4,8,10,20,30,40,50,60,70,80,90,100]

for workload in workload_list:
    for stage in ["load", "run"]:
        report_file_name = f'report_{workload["alias"]}_{stage}'

        plt.title(f'Throughput (ops/sec)\n depending on number of threads')
        for db in db_list:
            throughput_list = []
            for thread in thread_list:
                with open(f'benchmark_results/{workload["alias"]}_threads_{thread}/{stage}_{db["alias"]}', 'r') as file:
                    content = file.read()

                    match = re.search(r"Throughput\(ops\/sec\), (\d+\.\d+)", content)
                    throughput_list.append(float(match.group(1)))

            plt.plot(thread_list, throughput_list, label = db["name"])
        plt.ylabel('Throughput, ops/sec')
        plt.legend()
        plt.savefig(f"report_output/{report_file_name}.png")
        plt.clf()
