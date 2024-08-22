
## pycharm项目中出现的问题及解决方法

1、`no such file or directory`  
这是因为文件路径有问题，要检查一下文件的路径，相对路径的时候要查看一下当前的工作路径

2、`AssertionError:`  
文件的执行要带参数，在 Edit configeration 里面将 parameters 填上参数，可查看 README 获取相关信息

3、`AssertionError: Torch not compiled with CUDA enabled`  
原因：没有安装 cuda 或 cuda 版本不对  
解决方法：先查看自己电脑的显卡 GPU 支持什么类型的 cuda（在 NVDIA 设置里面可以查看），再上 [cuda 官网](https://developer.nvidia.com/cuda-toolkit-archive)下载对应的 cuda 版本，下载完之后打开 cmd 输入`nvcc --version`查看 cuda 是否下载成功，下载成功之后再下载相对应的 [cudnn](https://developer.nvidia.com/zh-cn/cudnn) 版本，将下载后的压缩包解压，将里面的文件放到 cuda 文件中相对应的文件夹下，最后再下载 [pytorch](https://pytorch.org/)，查看 cuda 对应的 pytorch 版本，以及用 pip 下载 pytorch 的命令，然后在 cmd 中用 pip 下载 pytorch ，下载完成后在 cmd 中依次输入`python、 import torch、 torch.cuda.is_available`命令，若结果出现`function is_available at 0x000001DD4B99CBF8 `，则成功；或者在 cmd 进入 python ，先输入`import cuda`，再输入` print(torch.cuda.is_available()) `打印是否有 cuda 可用，或者输入 `print(torch.verision.cuda)`打印 cuda 的版本。

4、`RuntimeError: view size is not compatible with input tensor‘s size and stride`  
原因：用多卡训练的时候 tensor 不连续，即 tensor 分布在不同的内存或显存中。  
解决方法：对 tensor 进行操作时先调用`contiguous()`。如`tensor.contiguous().view()` 或者`out = out.contiguous().view(out.size()[0], -1) `。