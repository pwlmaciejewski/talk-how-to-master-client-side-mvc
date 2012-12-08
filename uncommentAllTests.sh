cat test/testTodo.js | gawk '{ gsub (/\/\//, ""); print }' > test/testTodo.new.js
mv test/testTodo.new.js test/testTodo.js
