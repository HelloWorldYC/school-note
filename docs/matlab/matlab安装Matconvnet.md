## matlab安装Matconvnet

### 安装步骤

`前提：已经安装好 CUDA 和 CUDNN ，最好先安装 Visual Studio 再安装 matlab ，否则在 matlab 里 mex -setup 命令关联不到 VS 的 c++ 编译器，并且 VS 要自定义安装，选择 c++ 。`

1、首先，在[官网](https://www.vlfeat.org/matconvnet/)上下载matconvnet压缩包。

2、安装 matlab 支持的编译器 MinGW，在[官网](https://ww2.mathworks.cn/matlabcentral/fileexchange/52848-matlab-support-for-mingw-w64-c-c-compiler)上下载，之后将下载好的文件放在 matlab 的 bin 文件夹中，打开 matlab ，将当前目录切换到 bin 中，打开下载好的文件，根据步骤进行安装。

3、若没有 Visual Studio，则需要下载 Visual Studio ，之后在 matlab 命令窗口依次输入以下命令：
```matlab
>> cd <MatConvNet>;   % 将路径切换到matconvnet文件夹下
>> addpath matlab;
>> vl_compilenn;
>> vl_testnn;
```
以上是使用CPU的情况，使用GPU的编译流程如下：
```matlab
>> vl_compilenn('enableGpu', true);
```
或者：
```matlab
>> vl_compilenn('enableGpu', true, ...
               'cudaRoot', '/Developer/NVIDIA/CUDA-7.5', ...    %这里是CUDA的安装地址，一般是在C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.0这里。
               'cudaMethod', 'nvcc', ...
               'enableCudnn', true, ...
               'cudnnRoot', 'local/cudnn-rc4') ;                %这里是CUDNN的安装地址，依据个人情况的不同。
```
编译成功后使用以下命令：
```matlab
>> vl_testnn('gpu', true);    % 这条命令编译需要很长时间
```

注意：  
1）Matconvnet 只需要配置一次，不同的算法，直接把配置好的 Matconvnet，路径下的 `MATLAB/mex` 的文件拷贝到需要运行的算法对应位置处即可，不需要每次都配置。  
2）Matlconvnet 可以编译成功，但是每次开 matlab 都需要编译一次？不需要，关闭 matlab 重新打开后，先运行 gpuDevice 然后就可以正常使用了 Matconvnet 了。


### 出现的问题及解决方案  
1、在输入`vl_compilenn`这步可能会出现如下问题：
```matlab
警告: CL.EXE not found in PATH. Trying to guess out of mex setup. 
> In vl_compilenn>check_clpath (line 650)
  In vl_compilenn (line 426) 
'cl.exe' 不是内部或外部命令，也不是可运行的程序 
或批处理文件。 
错误使用 vl_compilenn>check_clpath (line 656)
Unable to find cl.exe

出错 vl_compilenn (line 426)
    cl_path = fileparts(check_clpath()); % check whether cl.exe in path
```
解决方案：这是因为系统没找到 cl.exe 文件，这个文件在 Visual Studio 中的，一般在`E:\Program Files (x86)\Microsoft Visual Studio\VC\Tools\MSVC\14.16.27023\bin\Hostx86\x86`中。注意，在下载安装VS时要把编译器的那些选项选上，才能找到 VC 文件夹。找到 cl.exe 文件，然后将其将其路径添加到环境变量中即可。具体添加过程如下：  
1）打开此电脑，右键点击属性，然后点击左侧的高级系统设置，再点击环境变量，我们这里在用户变量中添加即可。  
2）找到 Path，双击然后在末尾添加你电脑中 cl.exe 对应的路径。到这里测试一下，按 Windows + R 的组合键，然后输入 cmd 命令，打开控制台，输入 cl 。


2、在输入`vl_compilenn`这步可能会出现如下问题：
```matlab
出错 vl_compilenn>mex_link (line 627)
mex(args{:}) ;
出错 vl_compilenn (line 500)
mex_link(opts, objs, flags.mex_dir, flags) ;
```
解决方案：这是因为 matlab 不支持 Mingw 编译器（虽然 matlab 很推荐），要使用 Visual Studio 的 C++ 编译器，先在 matlab 命令窗口输入`mex -setup -v`命令，查看可以使用的编译器，若有 Visual Studio 编译器则使用，若没有 Visual Studio 编译器，可能是因为注册表中没有 Microsoft SDK 这个注册表项，需要在 Visual Studio 安装界面（不管有没有安装好），在组件中找到 Visual Studio SDK 和 Windows 10 SDK 选上，安装或修改。之后重新打开 matlab ，重新输入命令 `vl_compilenn` ，则可以正确编译。


3、在`vl_compilenn('enableGpu', true)`时可能会出现如下错误：
```matlab
Error using vl_compilenn>nvcc_compile (line 615)
Command "C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v9.0\bin\nvcc" -c -o
"D:\Matlab\matconvnet-1.0-beta25\matconvnet-1.0-beta25\matlab\mex\.build\bits\data.obj"
"D:\Matlab\matconvnet-1.0-beta25\matconvnet-1.0-beta25\matlab\src\bits\data.cu" -DENABLE_GPU -DENABLE_DOUBLE
-DENABLE_CUDNN -I".local\cudnn\include" -O -DNDEBUG -D_FORCE_INLINES --std=c++11
-I"D:\Matlab\extern\include" -I"D:\Matlab\toolbox\distcomp\gpu\extern\include"
-gencode=arch=compute_52,code=\"sm_52,compute_52\"  --compiler-options=/MD --compiler-bindir="C:\Program
Files (x86)\Microsoft Visual Studio\2017\Community\VC\bin"  failed.

Error in vl_compilenn (line 487)
      nvcc_compile(opts, srcs{i}, objfile, flags) ;
```
解决方案：（以下几个步骤可能都需要用到，不确定哪个是对的）  
1）在 `C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\VC` 下创建 bin 文件夹。  
2）在 matconvnet-1.0-beta25（建议重命名文件夹改为 matconvnet）中建一个 local 文件夹（与 example 和 matlab 等同一“级别”），然后把下载的 cudnn 放进去。  
3）更改 matlab 配置 GPU 的配置文件，其路径是 `D:\Softwares\MATLAB\toolbox\distcomp\gpu\extern\src\mex\win64` ，在其中有多个文件如 `nvcc_msvcpp2015_dynamic.xml ,nvcc_msvcpp2015.xml`等文件，打开这些文件，注意，这里需要更改的配置文件与使用编译的 Visual Studio 版本有关，本人 VS 版本是2017，所以更改 `nvcc_msvcpp2017.xml`和`nvcc_msvcpp2017_dynamic.xml`即可，为保险起见，将这些文件全部修改。具体修改是将文件中CUDA版本如`8.0`改为自己所安装的 CUDA 版本`11.0`，注意是全部替换掉。  
4）打开`vl_compilenn.m`，更改687行，原先是：
```matlab
for v = {'5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0'}；
```
将其改为：
```matlab
for v = {'5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '11.0'}  %这里最后新添加的‘11.0’是指自己的CUDA版本；
```
<br/>

4、在`vl_compilenn('enableGpu', true)`时可能会出现如下错误：
```matlab
nvcc fatal   : '-DNDEBUG': expected a number 
错误使用 vl_compilenn>nvcc_compile (line 615)
Command "C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.1\bin\nvcc" -c -o
"E:\matconvnet\matlab\mex\.build\bits\data.obj"
"E:\matconvnet\matlab\src\bits\data.cu" -DENABLE_GPU
-DENABLE_DOUBLE -O -DNDEBUG -D_FORCE_INLINES --std=c++11 -I"D:\Softwares\MATLAB\extern\include"
-I"D:\Softwares\MATLAB\toolbox\distcomp\gpu\extern\include" -gencode=arch=compute_75,code=\"sm_75,compute_75\"  --compiler-options=/MD
--compiler-bindir="D:\Softwares\VisualStudio\VC\Tools\MSVC\14.16.27023\bin\Hostx64"  failed.

出错 vl_compilenn (line 487)
      nvcc_compile(opts, srcs{i}, objfile, flags) ;
```
出现原因：CUDA 10.1 以前的版本使用非 debug 模式下 GPU 优化指令是`-O`，CUDA 10.1以上版本把`-O`指令给弃用了。现在的指令为`-O+`数字，此处的数字为优化的等级。`vl_compilenn`默认编译是非 debug 模式的，所以 matlab 会提示我们需要一个数字。  
解决方案：将`vl_compilenn.m`，将606行的`nvcc_compile`函数进行更改。原先的函数为：
```matlab
function nvcc_compile(opts, src, tgt, flags)
% --------------------------------------------------------------------
if check_deps(opts, tgt, src), return ; end
nvcc_path = fullfile(opts.cudaRoot, 'bin', 'nvcc');
nvcc_cmd = sprintf('"%s" -c -o "%s" "%s" %s ', ...
                   nvcc_path, tgt, src, ...
                   strjoin(horzcat(flags.base,flags.nvcc)));
opts.verbose && fprintf('%s: NVCC CC: %s\n', mfilename, nvcc_cmd) ;
status = system(nvcc_cmd);
if status, error('Command %s failed.', nvcc_cmd); end;
```
更改后的函数为：
```matlab
function nvcc_compile(opts, src, tgt, flags)
% --------------------------------------------------------------------
mybase=flags.base;
mybase(3)={'-O3'};
if check_deps(opts, tgt, src), return ; end
nvcc_path = fullfile(opts.cudaRoot, 'bin', 'nvcc');
nvcc_cmd = sprintf('"%s" -c -o "%s" "%s" %s ', ...
                   nvcc_path, tgt, src, ...
                   strjoin(horzcat(mybase,flags.nvcc)));
opts.verbose && fprintf('%s: NVCC CC: %s\n', mfilename, nvcc_cmd) ;
status = system(nvcc_cmd);
if status, error('Command %s failed.', nvcc_cmd); end;
```


























