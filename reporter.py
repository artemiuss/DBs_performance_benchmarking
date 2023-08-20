#!/usr/bin/env python3
from matplotlib import pyplot as plt

db_list = [{"name":"PostgreSQL", "alias":"postgresql"}, {"name":"MySQL", "alias":"mysql"}, {"name":"MongoDB", "alias":"mongodb"}]

report_file_name = "report"

threads = list(range(0, 100))
throughput = list(range(100, 200))
latency = list(range(0, 100))

plt.subplot(2, 1, 1)
plt.title(f'Throughput and latency\n depending on number of threads')
for db in db_list:
    plt.plot(threads, throughput, label = db["name"])
plt.ylabel('Throughput, ops/sec')
plt.legend()

plt.subplot(2, 1, 2)
for db in db_list:
    plt.plot(threads, latency, label = db["name"])
plt.ylabel('Latency, us')
plt.xlabel('Threads, number')
plt.legend()

plt.savefig(f"report_output/{report_file_name}.png")
