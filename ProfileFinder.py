import os

root_dir = r"C:\Users\ejlok\AppData\Local\Google\Chrome\User Data"

matches = []

# os.walk(root_dir) produces 3 tuples(lists that can not be changed) which are:
# (path, name of folders in this path, name of files in this path)

#  ("Root/B", [], ["file2.txt"])
# dirpath   = "Root"
# dirnames  = ["A", "B"]
# filenames = []

for (dirpath, dirnames, filenames) in os.walk(root_dir):  
    #dirname is just an arguments name.
    #if to censure that it is looking ONLY in this folder
    if root_dir == dirpath:
        # for each one of the matches combine 
        for dirname in dirnames:
            if "profile" in dirname.lower():  # case-insensitive match
                matches.append(dirname)



filter_out = [r"System Profile",r"Guest Profile"]
for m in matches:
    for r in filter_out:
        if (m ==r):
            matches.remove(r)
matches.insert(0,"Default")      
for m in matches:            
    print(m)
