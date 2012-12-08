cat test/testTodo.js | gawk '{ if ($0 ~ /^./) print "//" $0; else print }' > test/testTodo.new.js
mv test/testTodo.new.js test/testTodo.js
