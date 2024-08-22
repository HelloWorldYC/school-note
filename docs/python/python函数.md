## python函数

### 基本函数

#### print函数
* 功能：输出变量到控制台。在默认情况下，print 函数输出内容之后，会自动在内容末尾增加换行。如果不希望末尾增加换行，可以在 print 函数输出内容的后面增加 `end=""`，其中 `""` 中间可以指定 `print` 函数输出内容之后，继续希望显示的内容。  
* 例子：
```python
# 向控制台输出内容结束之后，不会换行
print("*", end="")
```

#### type函数
* 功能：查看变量类型

#### input函数
* 语法：`字符串变量 = input("提示信息：")` 
* 功能：从键盘等待用户的输入，输入的任何内容python都认为是一个字符串   

#### list函数
* 功能：把元组转换成列表
* 例子：
```python
list(元组) 
```

#### tuple函数
* 功能：把列表转换成元组
* 例子：
```python
tuple(列表)
```


### random工具包函数

#### randint 函数
* 语法：`random.randint(a, b)`  
* 功能：生成 [a, b] 之间的随机整数，包含 a 和 b  
* 例子：
```python
random.randint(12, 20)  # 生成的随机数n: 12 <= n <= 20   
random.randint(20, 20)  # 结果永远是 20   
random.randint(20, 10)  # 该语句是错误的，下限必须小于上限
```


### pandas工具包函数

#### drop 函数
- 语法:`DataFrame.drop(labels=None, axis=0, index=None, columns=None, level=None, inplace=False, errors='raise')`
- 功能:从行或列中删除指定的标签,即删除某一行或某一列
- 参数含义:
    - labels: 要删除的行或列,可以是指定的行序或列序,也可以是行名或列名
    - axis: 指定是删除行还是删除列, 0 表示行, 1 表示列,默认是 0
    - index: 指定行的替代方法, (`labels, axis=0` 等价于 `index=labels`)
    - columns: 指定列的替代方法,(`labels, axis=1` 等价于 `columns=labels`)
    - levels: 可选项,对于多索引,指定要删除标签的级别,可以是序号也可以是名称.比如在三维中,指定要删除第几个面的行列
    - i你place: 是否替换原来的数据, True 表示替换原数据, False 表示原数据名对应的内存值并不改变，而是将结果赋给一个新的数组.默认是 False
    - errors: `ignore`或`raise`, 默认`raise`. `ignore`抑制错误并仅删除现有标签,`raise`则抛出错误
- 返回值:`inplace=False`返回删除后的数据，`inplace=True`，则没有返回值,即为None