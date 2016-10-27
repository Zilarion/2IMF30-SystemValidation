#/bin/bash

rm results/results.out

for file in ./pbes/*.pbes
do
  (echo "$file"; pbes2bool "$file") | tee -a results/results.out
done
