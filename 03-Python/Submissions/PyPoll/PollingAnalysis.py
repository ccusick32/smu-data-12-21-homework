#imports and defining data path
import csv

csvpath = "Resources\\election_data.csv"

#variables
total_votes = 0
#Dictionary for candidates
candidate_dic = {
    "Li": 0,
    "Correy" : 0,
    "O'Tooley" : 0,
    "Khan" : 0,
}

#reading in CSV 
with open(csvpath, "r") as file:
    csvreader = csv.reader(file, delimiter=",")

    csvheader = next(csvreader)

    print(csvheader)
    print()


#Tallying votes
    for row in csvreader:
       #print(row)
      
        total_votes += 1
        

        if row[2] =="Li":
            candidate_dic["Li"] += 1
        elif row[2] == "Correy":
            candidate_dic["Correy"] += 1
        elif row[2] == "O'Tooley":
            candidate_dic["O'Tooley"] += 1
        else:
            candidate_dic["Khan"] += 1


print(total_votes)
print(candidate_dic)

#https://stackoverflow.com/questions/2608272/getting-key-with-maximum-value-in-dictionary
max_candidate = max(candidate_dic, key=candidate_dic.get)
max_votes = candidate_dic[max_candidate]

#printing results
results = f"""Election Results
-------------------------
Total Votes: {total_votes}
-------------------------\n"""

#for loop to generate table
for candidate in candidate_dic.keys():
    percent = 100*(candidate_dic[candidate] / total_votes)
    results += f"{candidate}: {round(percent, 2)}% ({candidate_dic[candidate]})\n"

results += f"""-------------------------
Winner: {max_candidate}
-------------------------
"""

print(results)

#write to a text file
with open("election_results.txt", "w") as file:
    file.write(results)
