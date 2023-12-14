export const FolderSystem = {
  0: {
    id: 0,
    title: '/',
    childIds: [1, 2, 3],
    parentId: 0,
  },
  1: {
    id: 1,
    title: 'Desktop',
    childIds: [4, 5],
    parentId: 0,
  },
  2: {
    id: 2,
    title: 'Documents',
    childIds: [],
    parentId: 0,
  },
  3: {
    id: 3,
    title: 'readme.md',
    content: <ul>
    <li>👋 Hi, I’m zhangyq</li>
    <li>📫 Contact me: 1325812043@qq.com</li>
    <li></li>
    </ul>,
    parentId: 0,
  },
  4: {
    id: 4,
    title: 'Reactdemo',
    childIds: [6],
    parentId: 1,
  },
  5: {
    id: 5,
    title: 'Nextdemo',
    childIds: [],
    parentId: 1,
  },
  6: {
    id: 6,
    title: 'useState.txt',
    content: <div>const [loading,setLoading]=useState(false)</div>,
    parentId: 4,
  },
}
