module.exports = {
    base: `/school-note/`,
    title: '上学时笔记',
    description: '怀念象牙塔时光',
    head: [['link', {rel: 'icon', href: '/images/myfavicon.png'}]],
    plugins: {
      '@maginapp/vuepress-plugin-katex': {
        delimiters: 'dollars'
      }
    },
    themeConfig: {
        navbar: true,          // 禁用导航栏
        sidebarDepth: 0,            // 侧边栏显示层数
        sidebar: [
          {
            title:'matlab',
            children:[
              './matlab/常用函数.md',
              './matlab/语法.md',
              './matlab/matlab安装Matconvnet.md'
            ]
          },
          {
            title:'python',
            children:[
              './python/pycharm出现的问题及解决方法.md',
              './python/python函数.md',
              './python/python语法规则.md',
              './python/面向对象.md'
            ]
          },
          {
            title:'无人机项目',
            children:[
              './无人机项目/PX4开发环境搭建.md',
              './无人机项目/对P110B的理解.md',
              './无人机项目/ROS学习心得.md',
            ]
          },
          {
            title:'数字图像处理',
            children:[
              './数字图像处理/基础概述.md',
              './数字图像处理/像素空间关系.md',
              './数字图像处理/图像的缩放.md',
              './数字图像处理/空域增强技术一.md'
            ]
          },
          {
            title:'深度学习',
            children:[
              './深度学习/卷积神经网络.md',
              './深度学习/矩阵求导.md',
              {
                title:'神经网络和深度学习',
                children:[
                  './深度学习/神经网络和深度学习/深度学习引言.md',
                  './深度学习/神经网络和深度学习/神经网络的编程基础.md'
                ]
              }
            ]
          },
          {
            title:'信源数估计',
            children:[
              './信源数估计/信源数估计综述.md',
              './信源数估计/一点想法.md',
              './信源数估计/各种信源算法.md',
              './信源数估计/知识细节.md',
              {
                title:'空间谱估计基础',
                children:[
                  './信源数估计/空间谱估计基础/空间谱估计数学模型.md',
                  './信源数估计/空间谱估计基础/阵列模型二阶统计特性.md',
                  './信源数估计/空间谱估计基础/空间谱估计基础知识.md',
                  './信源数估计/空间谱估计基础/信号源数估计.md',
                  './信源数估计/空间谱估计基础/前后向空间平滑法.md'
                ]
              }
            ]
          }
        ]
      }
  }