#!/usr/bin/env sh

var1=`date '+%Y-%m-%d %H:%M:%S'`

# 确保脚本抛出遇到的错误
set -e

echo '开始执行命令'

cd ./dist
# 保存所有的修改
git init
echo "执行命令：git add -A"
git add -A

# 把修改的文件提交
echo "执行命令：git commit -m "
git commit -m "deploy notes on $var1"

# 注意，若 git push 出现错误 10054，则可能是因为开启了代理的原因，将代理关闭再进行尝试
echo "执行命令：git push -f https://github.com/HelloWorldYC/school-note.git master:gh-pages"
git push -f https://github.com/HelloWorldYC/school-note.git master:gh-pages