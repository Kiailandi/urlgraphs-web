# regex used N[0-9]{1,6}:\s?
import re

print 'Insert input file path'
pathI = raw_input()

print 'Insert output file path'
pathO = raw_input()

input = open(pathI, 'r')
output = open(pathO, 'w')

file = ''
pattern = re.compile('N[0-9]{1,6}:\s?')

for line in input.readlines():
    file += line
    aliaslist = pattern.findall(file)
    for alias in aliaslist:
        file = file.replace(alias, '')
output.write(file)
print 'Result: ', '\n', file
input.close()
output.close()