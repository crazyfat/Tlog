import type { MockMethod } from 'vite-plugin-mock'

// 所有的接口就写在这里好了

export default [
  {
    url: '/api/home/log', // 请求首页的头部日志
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          {
            lid: '001',
            summary: 'this is summary one. 🍕',
            time: 'Thu Dec 11 2023',
          },
          {
            lid: '002',
            summary: 'this is summary two. 🍔',
            time: 'Thu Dec 12 2023',
          },
          {
            lid: '003',
            summary: 'this is summary three. 🌭',
            time: 'Thu Dec 13 2023',
          },
          {
            lid: '004',
            summary: 'this is summary four. 🍿',
            time: 'Thu Dec 14 2023',
          },
        ],
      }
    },
  },
  {
    url: '/api/home/menu', // 请求地址
    method: 'get', // 请求方式
    response: () => {
      return {
        code: '200',
        data: {
          level: 0,
          menuList: [
            {
              mid: '001',
              name: 'linux',
              des: 'linux运维相关知识点',
              children: [],
            },
            {
              mid: '02',
              name: 'scientificResearch',
              des: '科研过程笔记',
              children: [],
            },
            {
              mid: '003',
              name: 'recommendationSystem',
              des: '推荐系统相关',
              children: [],
            },
            {
              mid: '004',
              name: 'frontEndLearning',
              des: '前端学习知识',
              children: [],
            },
            {
              mid: '05',
              name: 'algorithmRecording',
              des: '算法记录笔记',
              children: [],
            },
            {
              mid: '006',
              name: 'autumnRecruitmentSummary',
              des: '前端学习知识',
              children: [],
            },
            {
              mid: '007',
              name: 'internshipExperience',
              des: '实习经历',
              children: [],
            },
          ],
        },
      }
    },
  },
] as MockMethod[]
