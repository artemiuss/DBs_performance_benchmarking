#!/usr/bin/env python3
import matplotlib.pyplot as plt

report_file_name = "report"

# create data
x = [10,20,30,40,50]
y = [30,30,30,30,30]

# plot lines
plt.plot(x, y, label = "line 1")
plt.plot(y, x, label = "line 2")
plt.legend()
plt.show()


plt.savefig(f"report_output/{report_file_name}.png")