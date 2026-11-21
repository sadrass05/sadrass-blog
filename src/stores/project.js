import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'blog_projects'

function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const savedProjects = JSON.parse(saved)
      const hasAllFields = savedProjects.length > 0 && 'techStack' in savedProjects[0]
      if (hasAllFields) {
        return savedProjects
      }
    }
  } catch (e) {
    console.error('Failed to load projects from localStorage:', e)
  }
  return [
    {
      id: 1,
      name: '星图导航系统',
      description: '基于神经网络的星际导航系统，支持实时路径规划和障碍规避',
      icon: 'compass',
      status: 'active',
      stars: '1.2K',
      forks: '328',
      language: 'Python',
      updated: '2024-01-15',
      tags: ['导航', 'AI', '神经网络'],
      techStack: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'NumPy'],
      completedDate: '2023-12-20',
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=space%20navigation%20system%20dashboard%20star%20map%20interface&image_size=landscape_16_9',
      detailUrl: '/project/1'
    },
    {
      id: 2,
      name: '量子通讯协议',
      description: '实现超光速量子纠缠通信的协议标准，支持跨星系实时通讯',
      icon: 'radio',
      status: 'active',
      stars: '892',
      forks: '256',
      language: 'C++',
      updated: '2024-01-14',
      tags: ['通讯', '量子', '协议'],
      techStack: ['C++', 'Qiskit', 'CUDA', 'Boost', 'ZeroMQ'],
      completedDate: '2023-11-15',
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20communication%20network%20nodes%20entanglement%20visualization&image_size=landscape_16_9',
      detailUrl: '/project/2'
    },
    {
      id: 3,
      name: '星舰能源管理',
      description: '高效能源分配与管理系统，优化能量利用效率达99%',
      icon: 'zap',
      status: 'completed',
      stars: '654',
      forks: '189',
      language: 'Go',
      updated: '2024-01-10',
      tags: ['能源', '管理', '效率'],
      techStack: ['Go', 'Kubernetes', 'Prometheus', 'Grafana', 'gRPC'],
      completedDate: '2023-10-08',
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=energy%20management%20dashboard%20power%20grid%20visualization&image_size=landscape_16_9',
      detailUrl: '/project/3'
    },
    {
      id: 4,
      name: '深空探测系统',
      description: '全自动深空探测无人机集群控制系统',
      icon: 'rocket',
      status: 'active',
      stars: '543',
      forks: '145',
      language: 'Python',
      updated: '2024-01-13',
      tags: ['探测', '无人机', '集群'],
      techStack: ['Python', 'ROS2', 'OpenCV', 'TensorRT', 'MQTT'],
      completedDate: '2023-12-01',
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=deep%20space%20probe%20drone%20swarm%20control%20system&image_size=landscape_16_9',
      detailUrl: '/project/4'
    },
    {
      id: 5,
      name: '智能驾驶AI',
      description: '星舰自动驾驶人工智能系统，支持全自动星际航行',
      icon: 'cpu',
      status: 'active',
      stars: '1.5K',
      forks: '423',
      language: 'Python',
      updated: '2024-01-12',
      tags: ['AI', '自动驾驶', '神经网络'],
      techStack: ['Python', 'PyTorch', 'Transformer', 'Ray', 'ONNX'],
      completedDate: '2023-11-25',
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spaceship%20autopilot%20AI%20cockpit%20interface&image_size=landscape_16_9',
      detailUrl: '/project/5'
    },
    {
      id: 6,
      name: '星际地图数据库',
      description: '银河系星图数据库，包含10亿+恒星位置信息',
      icon: 'map',
      status: 'completed',
      stars: '789',
      forks: '210',
      language: 'SQL',
      updated: '2024-01-08',
      tags: ['数据库', '星图', 'GIS'],
      techStack: ['PostgreSQL', 'PostGIS', 'Elasticsearch', 'Redis', 'Rust'],
      completedDate: '2023-09-30',
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=galactic%20star%20map%20database%20interface%203D%20visualization&image_size=landscape_16_9',
      detailUrl: '/project/6'
    },
    {
      id: 7,
      name: '生命维持系统',
      description: '闭环生态生命维持系统，支持长期星际航行',
      icon: 'heart',
      status: 'planning',
      stars: '321',
      forks: '89',
      language: 'C++',
      updated: '2024-01-05',
      tags: ['生命支持', '生态', '循环'],
      techStack: ['C++', 'Arduino', 'Raspberry Pi', 'Python', 'MATLAB'],
      completedDate: null,
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=closed%20loop%20ecosystem%20life%20support%20system%20greenhouse&image_size=landscape_16_9',
      detailUrl: '/project/7'
    },
    {
      id: 8,
      name: '防御护盾系统',
      description: '量子护盾生成系统，防护小行星撞击和能量武器',
      icon: 'shield',
      status: 'active',
      stars: '678',
      forks: '178',
      language: 'C++',
      updated: '2024-01-11',
      tags: ['防御', '护盾', '量子'],
      techStack: ['C++', 'CUDA', 'OpenCL', 'Vulkan', 'Real-Time'],
      completedDate: '2023-12-10',
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20shield%20protection%20system%20futuristic%20defense&image_size=landscape_16_9',
      detailUrl: '/project/8'
    },
    {
      id: 9,
      name: '数据分析平台',
      description: '实时数据分析和可视化平台，支持科学研究决策',
      icon: 'bar-chart',
      status: 'completed',
      stars: '456',
      forks: '123',
      language: 'JavaScript',
      updated: '2024-01-06',
      tags: ['数据分析', '可视化', 'BI'],
      techStack: ['Vue 3', 'D3.js', 'ECharts', 'Node.js', 'Apache Kafka'],
      completedDate: '2023-10-20',
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20analytics%20dashboard%20visualization%20charts%20interface&image_size=landscape_16_9',
      detailUrl: '/project/9'
    },
    {
      id: 10,
      name: '区块链星际账本',
      description: '去中心化跨星系交易账本系统，确保资产安全与可信',
      icon: 'link',
      status: 'active',
      stars: '723',
      forks: '198',
      language: 'Rust',
      updated: '2024-01-07',
      tags: ['区块链', '智能合约', '加密'],
      techStack: ['Rust', 'Substrate', 'Solidity', 'IPFS', 'Polkadot'],
      completedDate: '2023-11-05',
      screenshotUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blockchain%20interstellar%20ledger%20decentralized%20network&image_size=landscape_16_9',
      detailUrl: '/project/10'
    }
  ]
}

function saveProjects(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save projects to localStorage:', e)
  }
}

export const useProjectStore = defineStore('project', () => {
  const projects = ref(loadProjects())

  const loading = ref(false)
  const error = ref(null)

  const currentPage = ref(1)
  const pageSize = ref(9)

  const filteredProjects = computed(() => {
    return projects.value.sort((a, b) => new Date(b.updated) - new Date(a.updated))
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredProjects.value.length / pageSize.value)
  })

  const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredProjects.value.slice(start, end)
  })

  function getProject(id) {
    return projects.value.find(p => p.id === parseInt(id))
  }

  function createProject(project) {
    const newProject = {
      id: Date.now(),
      ...project,
      stars: '0',
      forks: '0',
      updated: new Date().toISOString().split('T')[0],
      status: 'active'
    }
    projects.value.unshift(newProject)
    saveProjects(projects.value)
    return newProject
  }

  function updateProject(id, updates) {
    const index = projects.value.findIndex(p => p.id === parseInt(id))
    if (index !== -1) {
      projects.value[index] = {
        ...projects.value[index],
        ...updates,
        updated: new Date().toISOString().split('T')[0]
      }
      saveProjects(projects.value)
      return projects.value[index]
    }
    return null
  }

  function deleteProject(id) {
    const index = projects.value.findIndex(p => p.id === parseInt(id))
    if (index !== -1) {
      const deleted = projects.value.splice(index, 1)[0]
      saveProjects(projects.value)
      const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'DELETE',
        id: deleted.id,
        name: deleted.name,
        description: deleted.description
      }
      console.log('[Project Store] Deleted project:', logEntry)
      try {
        const logs = JSON.parse(localStorage.getItem('blog_project_logs') || '[]')
        logs.unshift(logEntry)
        if (logs.length > 50) logs.pop()
        localStorage.setItem('blog_project_logs', JSON.stringify(logs))
      } catch (e) {
        console.error('[Project Store] Failed to log deletion:', e)
      }
      return deleted
    }
    return null
  }

  return {
    projects,
    loading,
    error,
    currentPage,
    pageSize,
    filteredProjects,
    totalPages,
    paginatedProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
  }
})