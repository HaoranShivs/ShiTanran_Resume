/**
 * 简历数据源 —— 所有页面内容都从这里读取。
 * 想改文案 / 加项目 / 换链接，只改这个文件即可，不用动 HTML。
 */
window.RESUME = {
  /* ---------- 基本信息 ---------- */
  profile: {
    name: '史浩然',
    nameEn: 'Shi Haoran',
    title: 'C++ 开发工程师',
    subtitle: '2026 届校园招聘 · 求职岗位：C++',
    avatar: 'assets/img/avatar.jpg',
    location: '桂林 / 杭州',
    age: '26 岁',
    gender: '男',
    phone: '13429799216',
    email: '13429799216@163.com',
    // TODO: 换成你自己的链接（留空则页面自动隐藏该按钮）
    github: '',
    blog: '',
    resumeFile: 'resume.pdf',
    summary:
      '计算机科学与技术硕士在读，研究方向为弱监督计算机视觉、红外小目标检测与传统图像处理。' +
      '熟悉 C++17 与现代 C++ 工程实践，具备高性能内存数据库内核、CUDA 算子开发与深度学习模型部署经验，' +
      '关注缓存友好设计、无锁并发与指令级优化。'
  },

  /* ---------- 教育背景 ---------- */
  education: [
    {
      school: '桂林电子科技大学',
      degree: '计算机科学与技术（硕士）',
      period: '2023-09 ~ 至今',
      details: [
        { label: '研究方向', value: '弱监督计算机视觉、红外小目标检测、传统图像处理' }
      ]
    },
    {
      school: '杭州电子科技大学',
      degree: '网络工程（本科）',
      period: '2018-09 ~ 2022-06',
      details: [
        { label: '专业成绩', value: 'GPA 3.89 / 5' },
        {
          label: '主修课程',
          value: '操作系统原理，数据库原理，计算机网络，网络设计与集成，计网管理，网络安全'
        }
      ]
    }
  ],

  /* ---------- 技能证书 ---------- */
  skills: [
    {
      icon: 'code',
      title: '编程能力',
      items: [
        '熟练使用 C++（熟悉 STL、智能指针、RAII、多线程）',
        '理解并行编程 OpenCL 原理',
        '熟练使用 Python',
        '熟悉 OpenCV 库',
        '熟悉深度学习框架 PyTorch、TensorFlow、MindSpore'
      ]
    },
    {
      icon: 'brain',
      title: '算法与模型',
      items: [
        '了解目标检测任务常用的 YOLO 系列和 Fast-RCNN 系列神经网络模型',
        '了解移动端神经网络模型的蒸馏、剪枝、量化等轻量化技术',
        '有将 YOLOv8n-pose 蒸馏部署到瑞芯 SOC 上、实现实时人体姿态检测的经验'
      ]
    },
    {
      icon: 'globe',
      title: '语言能力',
      items: ['CET-6 合格', '能够熟练地进行交流、读写']
    }
  ],

  /* ---------- 荣誉奖项 ---------- */
  awards: [
    { title: '华为 ICT 大赛省赛三等奖', note: '神经网络相关知识' },
    { title: '蓝桥杯 C++ 省赛二等奖', note: '' }
  ],

  /* ---------- 项目经验 ---------- */
  projects: [
    {
      name: '面向列式存储的高性能内存查询引擎',
      period: '2025-06 ~ 2025-07',
      role: '核心开发者',
      stack: [
        'C++17',
        'AVX2 Intrinsics',
        'Arena Memory Pool',
        'Delta Encoding',
        'Perf',
        'Google Benchmark'
      ],
      description:
        '自主研发的一款针对 OLAP 场景优化的轻量级内存数据库内核。实现了列式存储、向量化执行引擎及自适应内存管理模块。' +
        '旨在解决大规模数据聚合场景下的 CPU 缓存失效与内存分配瓶颈，单核吞吐量突破 50W QPS。',
      highlightsTitle: '核心行动和高性能优化',
      highlights: [
        {
          label: '向量化执行引擎',
          text: '基于 AVX2 指令集重写核心过滤与聚合算子，利用 _mm256 系列 Intrinsics 实现 8 路并行计算；设计 Expression Tree 动态组装算子，在支持复杂查询条件的同时，保持接近硬编码的性能，较标量实现提速 6-8 倍。'
        },
        {
          label: '缓存友好型存储与压缩',
          text: '采用 SoA (Structure of Arrays) 列式布局，并对单调递增的主键列实施 Delta 增量编码。不仅将内存占用降低 50%，更利用 CPU 流水线特性实现“解压 - 计算”重叠，大幅缓解内存带宽压力，L3 Cache Miss 率降低 65%。'
        },
        {
          label: '无锁内存池设计',
          text: '摒弃传统 malloc，实现基于 Thread-Local Arena Allocator 的查询内存池。通过预分配大块内存并按需切分，彻底消除高频小对象分配的系统调用开销与锁竞争，P99 延迟波动从 20ms 收敛至 2ms 以内。'
        },
        {
          label: '分支预测与流水线优化',
          text: '在热点路径使用位运算掩码（Bitwise Masking）替代条件分支，配合 Loop Unrolling 技术隐藏指令延迟；利用 _builtin_prefetch 进行软件预取，进一步掩盖内存访问延迟。'
        },
        {
          label: '全链路性能剖析',
          text: '建立基于 Google Benchmark 的自动化回归测试集，结合 Perf + FlameGraph 定位性能热点。在 1000 万行数据集的 SUM/COUNT 聚合测试中，QPS 达到 55W+，性能表现优于 DuckDB 原生解释器模式 25%。'
        }
      ]
    },
    {
      name: '基于 MindSpore 框架的前沿模型复现',
      period: '2021-12 ~ 2022-04',
      role: '核心开发者',
      stack: ['CUDA 编程', 'GPU 架构', '深度学习模型训练推理全流程', 'MindSpore'],
      description:
        '华为与高校联合项目，目标是在国产深度学习框架 MindSpore 上复现前沿的神经网络模型。' +
        '本人独立负责 Point-RCNN 点云目标检测模型的整体复现、训练验证及关键算子开发。',
      highlightsTitle: '核心行动与挑战',
      highlights: [
        {
          label: '算子实现',
          text: 'RoIPool3d 算子在 MindSpore 中缺失且无法通过算子组合实现的情况下，通过手动 CUDA 编程实现该算子，并实现 GPU 优化。最终 RoIPool3d 算子稳定运行，有效支撑模型训练。'
        },
        {
          label: '算子组合',
          text: '在 MindSpore API 生态尚不完善的情况下，通过组合现有算子，成功构建了模型所需的大部分功能模块。'
        }
      ]
    }
  ],

  /* ---------- 页面导航 ---------- */
  nav: [
    { id: 'about', label: '关于我' },
    { id: 'education', label: '教育背景' },
    { id: 'skills', label: '技能证书' },
    { id: 'projects', label: '项目经验' },
    { id: 'contact', label: '联系方式' }
  ]
};
