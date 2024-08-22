
## PX4开发环境搭建

### 搭建步骤
**（1）添加用户到 dialout 工作组**  
将创建的用户加入到用户组 dialout 中去，注销后重新登录。  
创建独立用户的目的是这样可以让开发环境分离开来，避免出现不同用户间的版本冲突等情况。  
将用户加入dialout用户组的目的是dialout拥有对串口tty的操作权限。
```shell
sudo usermod -a -G dialout $USER
```

**（2）安装软件包**  
更新软件源列表：
```shell
sudo apt-get update -y
```
安装git、zip、cmake、qt、ninja等必用软件包：
```shell
sudo apt-get install git zip qtcreator cmake build-essential genromfs ninja-build exiftool -y
```
安装常用python依赖包及管理工具：
```shell
sudo apt-get install python-argparse python-empy python-toml python-numpy python-yaml python-dev python-pip -y
sudo -H pip install --upgrade pip
sudo -H pip install pandas jinja2 pyserial cerberus
```

**（3）安装日志分析工具**  
Pyulog可以帮助处理 px4 的日志文件，尤其是在提取单个 topic 的数据时非常方便，建议安装。
```shell
sudo -H pip install pyulog
```

**（4）安装Gazebo仿真软件**  
```shell
# 依赖包安装：
sudo apt-get install protobuf-compiler libeigen3-dev libopencv-dev

# 设置软件包的来源：
sudo sh -c 'echo "deb http://packages.osrfoundation.org/gazebo/ubuntu-stable `lsb_release -cs` main" > /etc/apt/sources.list.d/gazebo-stable.list'

# 设置软件包密钥:
wget http://packages.osrfoundation.org/gazebo.key -O - | sudo apt-key add -

# 更新软件源列表:
sudo apt-get update -y

# 安装Gazebo:
sudo apt-get install gazebo9 -y

# 安装Gazebo9的依赖包：
sudo apt-get install libgazebo9-dev -y
```
- 更正：gazebo 还是要用版本7的，用9的可能有问题

**（5）安装ROS和MAVROS**  
```shell
# 设置软件包的来源：
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'

# 设置软件包密钥:
#sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 0xB01FA116
sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key F42ED6FBAB17C654

# 更新软件源列表:
sudo apt-get update

# 安装基础版ROS和MAVROS：
sudo apt-get install -y ros-kinetic-ros-base ros-kinetic-mavros ros-kinetic-mavros-extras

# 证书问题：
sudo c_rehash /etc/ssl/certs

# MAVROS支持包：
sudo geographiclib-get-geoids egm96-5

# rosdep初始化：
sudo rosdep init

# rosdep更新：
rosdep update

# 设置ros运行环境：
echo "source /opt/ros/kinetic/setup.bash" >> $HOME/.bashrc
source /opt/ros/kinetic/setup.bash
```

**（6）安装交叉编译器**  
在[这里](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads) 下载gcc，建议`2017-q4`版本，也可在百度网盘下载。
```shell
# 解压缩：
tar -jxf gcc-arm-none-eabi-7-2017-q4-major-linux.tar.bz2

# 配置编译环境，将编译器的路径放到.bashrc或者.profile文件中：
export PATH=/home/myc/gcc/gcc-arm-none-eabi-7-2017-q4-major/bin:$PATH

# 添加完后更新.bashrc文件
source ~/.bashrc 

# 查看编译器版本确认是否配置成功：
arm-none-eabi-gcc --version
```

**（7）安装QGC**
在安装之前，先运行以下命令：
```shell
sudo usermod -a -G dialout $USER
sudo apt-get remove modemmanager -y
sudo apt install gstreamer1.0-plugins-bad gstreamer1.0-libav gstreamer1.0-gl -y
```
重新登录使设置生效，接着下载 `QGroundControl.AppImage` ，再进入到 QGC 目录运行以下命令：
```shell
chmod +x ./QGroundControl.AppImage
./QGroundControl.AppImage
```

**（8）安装PX4源码**
```shell
# 下载代码：
git clone https://github.com/PX4/Firmware.git

# 更新子模块：
cd Firmware 
git submodule update --init --recursive

# 编译：（这一步是编译可以烧写到PX4上的固件，不修改固件的不一定需要用到）
make px4_fmu-v3_default   #（不一定是v3版本，还可能是v4 或 v2）

# 编译后上传：
make px4_fmu-v3_default upload
```

**（9）环境配置验证**  
打开一个 Terminal，进入到 px4 文件夹下，输入以下指令：
```shell
make px4_sitl_default gazebo
```
<br/>
<br/>

### 安装过程出现的问题：
- **`sudo apt-get update` 时出错：**
```shell
W: GPG 错误：http://packages.ros.org/ros/ubuntu xenial InRelease: 由于没有公钥，无法验证下列签名： NO_PUBKEY F42ED6FBAB17C654
W: 仓库 “http://packages.ros.org/ros/ubuntu xenial InRelease” 没有数字签名。
N: 无法认证来自该源的数据，所以使用它会带来潜在风险。
N: 参见 apt-secure(8) 手册以了解仓库创建和用户配置方面的细节。
```
解决方案：  
设置软件包密钥时，其最后的码要根据不同的电脑进行修改，根据错误中的提示修改，即修改  
`sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 0xB01FA116`为   
`sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key F42ED6FBAB17C654`
<br/>
<br/>

- **在`sudo rosdep init` 时出错：**  
```shell
ERROR: cannot download default sources list from:
https://raw.githubusercontent.com/ros/rosdistro/master/rosdep/sources.list.d/20-default.list
Website may be down.
```
问题原因：`raw.githubusercontent.com`网站不能访问，需要修改 hosts 文件，添加新网站的 ip 地址。  
解决方案：  
打开终端，输入`sudo gedit /etc/hosts`。  
在打开的文本最后添加：`199.232.28.133 raw.githubusercontent.com`。  
保存并退出，在终端中输入：`sudo rosdep init`。  
然后再输入：`rosdep update`。
<br/>
<br/>

- **当修改环境变量.bashrc文件后source出错时，重新修改回去，将错误的路径删掉：**
```shell
export PATH="$PATH:/usr/bin"
sudo gedit ~/.bashrc
source ~/.bashrc     # 修改完后更新环境变量
```
<br/>

- **安装 QGC 时执行`sudo apt-get remove modemmanager -y `命令出错：**
```shell
E: 无法获得锁 /var/lib/dpkg/lock-frontend - open (11: 资源暂时不可用)
E: 无法获取 dpkg 前端锁 (/var/lib/dpkg/lock-frontend)，是否有其他进程正占用它？
```
问题原因：可能是上次安装时没正常完成，而导致出现此状况。  
解决方案：将原先的`apt-get`进程杀死，重新激活新的`apt-get`进程，就可以让软件管理器正常工作了。查看`apt-get`的相关进程：`ps -e | grep apt `，然后将显示的进程杀死：`sudo kill [进程号]`
<br/>
<br/>

- **在安装QGC时执行`sudo apt install gstreamer1.0-plugins-bad gstreamer1.0-libav gstreamer1.0-gl -y `出错：**
```shell
E: 无法定位软件包 gstreamer1.0-gl
E: 无法按照 glob ‘gstreamer1.0-gl’ 找到任何软件包
E: 无法按照正则表达式 gstreamer1.0-gl 找到任何软件包
```
<br/>

- **在下载PX4源码更新子模块`git submodule update --init –-recursive`时出错：**
```shell
error: pathspec '–-recursive' did not match any file(s) known to git.
```
原因：上面的`--recursive`打错了，最好手打。  
若还是有问题，试试在`git submodule update --init --recursive`前先输入`git submodule sync --recursive`
<br/>
<br/>

- **编译PX4时出现以下类似这种错误：**
```shell
Failed to import yaml: No module named 'yaml'
You may need to install it using:
    pip3 install --user pyyaml
```
解决方案：
按照提示的改，即输入`pip3 install --user pyyaml`。
<br/>
<br/>

- **在`sudo apt-get install *** `时出错：**
```shell
下列软件包有未满足的依赖关系：
 libayatana-appindicator3-1 : 依赖: libayatana-indicator3-7 (>= 0.6.0) 但是它将不会被安装
 libegl1-mesa : 依赖: libgbm1 (= 18.0.5-0ubuntu0~16.04.1)
 libsane : 依赖: libsane1 (>= 1.0.31-4) 但是它将不会被安装
 perl-base : 破坏: debconf (< 1.5.61) 但是 1.5.58ubuntu2 正要被安装
             破坏: debconf:i386 (< 1.5.61)
 rygel : 依赖: libges-1.0-0 (>= 1.16) 但是它将不会被安装
 sane-utils : 依赖: update-inetd 但是它将不会被安装
              依赖: libsane1 (>= 1.0.27) 但是它将不会被安装
E: 错误，pkgProblemResolver::Resolve 发生故障，这可能是有软件包被要求保持现状的缘故。
```
解决方案：提示依赖什么，就安装依赖库及其版本号（低的那个），例如  
`sudo apt install libcupsimage2-dev=2.2.10-6+deb10u1`。
<br/>
<br/>

- **在`make px4_sitl_default gazebo` 时出错：编译器g++出错**  
问题原因：可能是内存不够。  
解决方法：将 swap 交换内存扩大，并启用，因为有可能并没有启用。
<br/>
<br/>

- **gazebo卡在加载世界模型界面/加载太慢**  
解决方案：直接下载所有模型到用户的根目录下的`.gazebo/models/`下：
```shell
cd ~/.gazebo/
mkdir -p models
cd ~/.gazebo/models/
wget http://file.ncnynl.com/ros/gazebo_models.txt
```
输出了`gazebo_models.txt`，可用 ls 查看
继续运行：
```shell
wget -i gazebo_models.txt
ls model.tar.g* | xargs -n1 tar xzvf
```
<br/>

- **make px4_sitl_default gazebo 时出现错误：虚拟机无法分配内存**


