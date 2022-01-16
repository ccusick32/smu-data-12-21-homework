#imports and filepat set up
import csv

csvpath = "PyBank\\Resources\\budget_data.csv"

#variables
total_months = 0
total_profit = 0

changes = []
change_months =[]
previous_profit = 0

#read in CSV
with open(csvpath, "r") as file:
    csvreader = csv.reader(file, delimiter=",")

    csvheader = next(csvreader)

    print(csvheader)
    print()

    for row in csvreader:
        total_months += 1
        total_profit += int(row[1])
        
        #exclusion of the first row
        if total_months > 1:
            change = int(row[1]) - previous_profit
            changes.append(change)
            change_months.append(row[0])
        
       #add to list and reset
        previous_profit = int(row[1])
        
        print(row)


#math for summary table
print(total_months)
print(total_profit)
avg_change = sum(changes) / len(changes)
max_change = max(changes)
min_change = min(changes)

print(max(changes))
print(min(changes))


max_month_index = changes.index(max(changes))
max_month = change_months[max_month_index]

min_month_index = changes.index(min(changes))
min_month = change_months[min_month_index]

print(max_month)
print(min_month)

summaryTable = f"""Financial Analysis
  ----------------------------
  Total Months: {total_months}
  Total: ${total_profit}
  Average  Change: ${avg_change}
  Greatest Increase in Profits: {max_month} (${max_change})
  Greatest Decrease in Profits: {min_month} (${min_change})
"""

print(summaryTable)
#write to a text file
with open("bank_analysis.txt", "w") as file:
    file.write(summaryTable)

    