
## ROS学习心得

- ROS：框架＋工具＋功能＋社区  
ROS架构分为三个层次：OS层、中间层、应用层。  
从系统实现的角度看，ROS也可分为三个层次：文件系统、计算图、开源社区。  
ROS中的节点是一些执行运算任务的进程。  
package：功能包，是ROS中的基本组织形式，编译（catkin）的基本单元，亦即编译的对象。  
CMakeLists.txt：规定编译的规则。

1、利用`catkin_make`编译工作空间  
（1）建立工作空间，一定要有src文件（编写源码的地方）
```shell
mkdir -p ~/catkin_ws/src   # catkin_ws是工作空间，名称可以自己修改
cd ~/catkin_ws/
catkin_make
```
（2）编译（必须回到工作空间进行编译）
```shell
cd ~/catkin_ws/
catkin_make
source ~/catkin_ws/devel/setup.bash		# 刷新环境
``` 
<br/>


2、一个 package 可以包含多个可执行文件（节点），但其至少要有 CMakeLists.txt 和 package.xml 这两个文件。  
（1）CMakeLists.txt：
```cmake
cmake_minimum_required()  	# 指定catkin最低版本
project()   				# 指定软件包的名称
find_package()				# 指定编译时需要的依赖项
add_message_files()			# 添加消息文件
add_service_files()			# 添加服务文件
add_action_files()			# 添加动作文件
generate_messages()			# 生成消息、服务、动作
catkin_package()			# 指定catkin信息给编译系统生成Cmake文件
add_library()				# 指定生成库文件
add_executable()			# 指定生成可执行文件
target_link_libraries()		# 指定可执行文件需要链接哪些库
catkin_add_gtest()			# 添加测试单元
install()					# 生成可安装目标
```
（2）package.xml：
```xml
<package>						<!--根标签-->
	<name>							<!--包名-->
	<version>						<!--版本号-->
	<description>					<!--包描述-->
	<maintainer>					<!--维护者-->
	<license>						<!--软件许可-->
	<buildtool_depend>				<!--编译工具-->
	<build_depend>					<!--编译时的依赖-->
	<run_depend>					<!--运行时的依赖-->
</package>						<!--根标签-->
```

（3）代码文件：脚本（shell、python）、C++（头文件、源文件）  
			   
（4）自定义通信格式：message消息(\*.msg)、service服务（\*.srv）、action动作（\*.action）  
在自定义服务类型时，在 CmakeList.txt 中要添加如下配置：
```cmake
find_package(catkin REQUIRED COMPONENTS
  geometry_msgs
  roscpp
  rospy
  std_msgs
  message_generation
)
add_service_files(
   FILES
   AddTwoInts.srv
 )
generate_messages(
   DEPENDENCIES
   std_msgs
 )
 ```
在编译功能包时，要在 CmakeList.txt 中要添加如下配置：
```cmake
include_directories(include ${catkin_INCLUDE_DIRS})
add_executable(server src/server.cpp)
add_dependencies(server ${${AddTwoInts}_EXPORTED_TARGETS} ${catkin_EXPORTED_TARGETS})
target_link_libraries(listener ${catkin_LIBRARIES})
```

（5）launch文件以及配置文件：  
launch文件：一次性运行多个可执行文件。  
配置文件：yaml

（6）一个典型package文件的构成：  
```
CMakeLists.txt  
package.xml  
scripts：*.py、*.sh  
include：*.h  
src：*.cpp  
msg：*.msg  
srv：*.srv  
launch：*.launch  
```
<br/>

3、常用包管理命令：
```shell
# 查找某个pkg的地址
rospack find package_name

# 列出本地所有pkg
rospack list

# 跳转到某个pkg的路径下
roscd package_name

# 列举某个pkg下的文件信息
rosls package_name

# 编译pkg中的文件
rosed package_name file_name

# 创建一个pkg
catkin_create_pkg [pkg_name] [depends_name]

# 安装某个pkg所需的依赖
rosdep install [pkg_name]

# 启动ros master
roscore

# 日志输出
rosout

# 参数服务器
parameter server

# 启动一个node
rosrun [pkg_name] [node_name]

# 列出当前运行的node信息
rosnode list

# 显示某个node的详细信息
rosnode info [node_name]

# 结束某个node
rosnode kill [node_name]

# 启动master和多个node
roslaunch [pkg_name] [file_name.launch] 
```
<br/>

4、ROS通信  
+ ROS的核心：分布式网络，使用了基于TCP/IP的通信方式，实现了模块间点对点的松耦合连接，可以实现若干种类型的通信。  
+ ROS是一个分布式框架，为用户提供多节点（进程）之间的通信服务，所有软件功能和工具都建立在这种分布式通信机制上。  
+ ROS的通信机制：话题通信机制、服务通信机制、参数管理通信机制。

（1）话题通信机制工作原理：  
发布者 Talker 通过 RPC 向 ROS Master 注册信息；  
订阅者 Listener 通过 RPC 向 ROS Master 注册信息；  
ROS Master 进行信息匹配，若匹配成功则通过 RPC 向 Listener 发送 Talker 的 RPC 地址信息；  
Listener 通过 RPC 向 Talker 发送连接请求；  
Talker 接收连接请求，通过 RPC 向 Listener 确认连接信息；  
Listener 尝试与 Talker 建立网络连接（TCP方式）  
Talker 向 Listener 发布数据。  

（2）服务通信机制原理：  
Talker 注册；  
Listener 注册；  
ROS Master 进行信息匹配，若匹配成功则向 Listener 发送 Talker 的 TCP 地址信息；  
Listener 使用 TCP 尝试与 Talker 建立网络连接，并且发送服务的请求数据；  
Talker 接收服务请求和参数后，开始执行服务功能，执行完成后，向 Listener 发送应答数据。  

（3）参数管理机制原理：  
Talker 设置变量，使用 RPC 向 ROS Master 发送参数设置数据，包含参数名和参数值;  
ROS Master 会将参数名和参数值保存到参数列表中；  
Listener 通过 RPC 向 ROS Master 发送参数查找请求，包含所要查找的参数名；  
ROS Master 根据 Listener 的查找请求从参数列表中进行查找，查找到参数后，使用 RPC 将参数值发送给 Listener。
<br/>

5、环境变量  
设置环境变量是为了让系统知道功能包的位置在哪，以便能找到。  
环境变量的设置脚本文件是`setup.bash`。  
让环境变量在所有终端中有效，则需要在终端的配置文件中加入环境变量的设置
```shell
echo "source /WORKSPACE/devel/setup.bash" >> ~/.bashrc
```

6、工作空间的覆盖：  
新设置的路径在`ROS_PACKAGE_PATH`中会自动放置在最前端。在运行时，ROS 会优先查找最前端的工作空间是否存在指定的功能包，如果不存在，就顺序向后查找其他工作空间，直到最后一个工作空间为止。

7、创建 Publisher 发布者：  
（1）头文件；  
（2）初始化节点；  
（3）创建节点句柄；  
（4）在 Master 端注册一个 Publisher。
