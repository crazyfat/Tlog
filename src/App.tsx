import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reqLogInfo, reqMenu } from './api'
import { CommandNotFound, Help, NoSuchFileOrDirectory, Row } from './cmpts/components'
import { getStorage, key, setStorage } from './utils'
import { FolderSystem } from './mock'
import { addMenu } from './redux/actions/menu'
import {popPwd, pushPwd} from "./redux/actions/pwd";
import pwd from "./redux/reducer/pwd";
import redux from "./redux";

interface CommandList {
  [key: string]:
  { (): void } | { (arg: string): void }
}
interface Log {
  lid: string | undefined
  summary: string | undefined
  time: string | undefined
}
interface MEnu {
  mid: string
  name: string
  des: string
  children: MEnu[] | undefined
}
interface FolderSysteamType {
  id: number
  title: string
  content: any
  childIds?: []
  parentId: number
}
const CURRENTID = 'currentId'
const CURRENTFOLDERID = 'currentFolderId'
const CURRENTCHILDIDS = 'currentChildIds'
const CURRENTDIRECTORY = 'currentDirectory'
function App() {
  const [menuList, setMenuList] = useState<MEnu[]>([])
  const [logList, setLogList] = useState<Log[]>([])
  const [curTime, setCurTime] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [changeCount, setChangeCount] = useState<number>(0)
  const [currentId, setCurrentId] = useState<number>(0)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [folderSysteam, setFolderSysteam] = useState(new Map(Object.entries(FolderSystem)))
  const [currentFolderId, setCurrentFolderId] = useState(0)
  const [currentDirectory, setCurrentDirectory] = useState<string>('')
  const [content, setContent] = useState<JSX.Element[]>(
    [<Row
      id={0}
      key={key()}
      onkeydown={(e: React.KeyboardEvent<HTMLInputElement>) => executeCommand(e, 0)}
    />,
    ])
  // redux数据
  const pwdInfo = useSelector((state) => {
    return state.pwdReducer
  })
  const menuInfo = useSelector((state) => {
    return state.menuReducer
  })
  const numb = useSelector(state=>state.countReducer)
  const dispatch = useDispatch()
  // 初始化
  useEffect(() => {
    setCurrentId(0)
    setCurrentDirectory('')
    setCurrentFolderId(0)
    const tempTime = new Date()
    setCurTime(tempTime.toString().split(' ').slice(0, 5).join(' '))
    reqLogInfo().then((value) => { setLogList(value.data) })
  }, [])
  useEffect(() => { setMenuList({})}, [menuInfo, pwdInfo])
  useEffect(() => {
    setStorage(CURRENTID, currentId)
  }, [currentId])
  useEffect(() => {
    setStorage(CURRENTDIRECTORY, currentDirectory, false)
  }, [currentDirectory])
  useEffect(() => {
    const currentFolder = folderSysteam.get(`${currentFolderId}`) as FolderSysteamType
    setStorage('currentFolderId', currentFolderId)
    currentFolder.childIds && setStorage(CURRENTCHILDIDS, currentFolder.childIds)
  }, [currentFolderId, folderSysteam])

  // 当按下上下键时 获取历史 command
  useEffect(() => {
    const input = document.querySelector(`#terminal-input-${commandHistory.length}`) as HTMLInputElement
    if (commandHistory.length)
      input.value = commandHistory[commandHistory.length + changeCount]
    if (!changeCount) {
      input.value = ''
      setChangeCount(0)
    }
  }, [changeCount])
  // 生成内容
  const generateRow = (row: JSX.Element) => {
    setContent(s => [...s, row])
  }
  // cat 命令
  const cat = (arg = '') => {
    // 获取当前目录下 childIds 进行遍历
    const ids = getStorage(CURRENTCHILDIDS)
    ids.map((id: number) => {
      const item = folderSysteam.get(`${id}`) as FolderSysteamType
      // 生成 title 为 arg 文件的 content Row 行
      return item.title === arg ? generateRow(<div key={key()}>{item.content}</div> as JSX.Element) : ''
    })
  }
  const searchFile = (arg: string) => {
    // 对输入做一个优化，例如文件夹名为 Desktop,只要我们输入'Desktop'|'desktop'|'DESKTOP'都行
    const args = [arg, arg.toUpperCase(), arg.toLowerCase(), arg.charAt(0).toUpperCase() + arg.slice(1)]
    // 获取当前目录下子目录
    const childIds = getStorage(CURRENTCHILDIDS)
    // 遍历子目录，找到title 为 arg 的目录
    for (const item of folderSysteam.entries()) {
      if (childIds.includes(item[1].id) && args.includes(item[1].title))
        return item[1].id
    }
  }
  // cd 命令
  const cd = (arg = '') => {
    const dir: string = localStorage.getItem(CURRENTDIRECTORY) as string
    if (!arg || arg === '..') {
      // 处理文件路径
      const dirArr = dir.split('/')
      dirArr.length = Math.max(0, dirArr.length - 2)
      if (!dirArr.length)
        setCurrentDirectory(`${dirArr.join('')}`)
      else
        setCurrentDirectory(`${dirArr.join('')}/`)
      // 处理当前文件夹
      setCurrentFolderId(folderSysteam.get(`${currentFolderId}`)?.parentId as number)
      return
    }

    const id = searchFile(arg)
    // 如果子目录存在,设置路径、更新当前目录id
    if (id) {
      const res = `${dir + folderSysteam.get(`${id}`)?.title}/`
      setCurrentFolderId(id)
      setCurrentDirectory(res)
    }
    // 否则返回 NoSuchFileOrDirectory
    else { generateRow(<NoSuchFileOrDirectory key={key()} command={arg}/>) }
  }
  // clear 命令
  const clear = () => {
    setContent([])
    // 清空 input 框内容
    const input = document.querySelector('#terminal-input-0') as HTMLInputElement
    input.value = ''
  }
  const onInce = ()=>{
    dispatch(pushPwd({ids:2, path: 'hio'}))
    console.log('onInce:',pwdInfo)
  }
  // ls 命令
  const ls = async () => {
    // 当前位置为：pwd.ids[pwd.ids.length-1]
    const curIds = pwdInfo[pwdInfo.ids[pwdInfo.ids.length - 1]]
    onInce()
    //dispatch(pushPwd({id:1, path:'fjsjdf'}))
    console.log('pwdInfo in',pwdInfo)
    let childrenInfo: MEnu[] = []
    if (menuInfo.hasOwnProperty(curIds)) {
      console.log('from redux')
      childrenInfo = menuInfo.curIds.children
    }
    else {
      console.log('from request')
      // 此处存入redux
      await reqMenu().then((res) => {
        //dispatch(addMenu(res.data))
        childrenInfo = res.data.children
      })
    }
    let res = ''
    // 获取当前目录下所有子目录 id
    const ids = getStorage(CURRENTCHILDIDS)
    // 遍历 id 进行拼接
    for (const id of ids)
      res = `${res + folderSysteam.get(`${id}`)?.title} `
    if (!res) {
      generateRow(<div key={key()} >There are no other folders or files in the current directory.</div>)
    }
    else {
      res.split(' ').map((item: string) =>
        generateRow(<div key={key()} className={item.includes('.') ? 'text-blue-500' : ''}>{item}</div>),
      )
    }
  }
  // help 命令
  const help = () => {
    generateRow(<Help key={key()} />)
  }

  // mkdir 命令
  const mkdir = (arg = '') => {
    const currentFolderId = getStorage(CURRENTFOLDERID)
    const size = folderSysteam.size.toString()
    // 创建新对象
    const newFolderSysteam = folderSysteam.set(`${size}`, {
      id: +size,
      title: arg,
      childIds: [],
      parentId: currentFolderId,
    })
    // 更新 当前文件夹下的 childIds
    const childIds = (folderSysteam.get(`${currentFolderId}`) as FolderSysteamType).childIds as number[]
    childIds && childIds.push(+size)
    setStorage(CURRENTCHILDIDS, childIds)
    setFolderSysteam(newFolderSysteam)
  }
  // touch 命令
  const touch = (arg = '') => {
    const currentFolderId = getStorage(CURRENTFOLDERID)
    const size = folderSysteam.size.toString()
    // 创建新对象
    const newFolderSysteam = folderSysteam.set(`${size}`, {
      id: +size,
      title: arg,
      content: <div ><h1>
        This is <span className='text-red-400 underline'>{arg}</span> file!
        </h1>
        <p>Imagine there's a lot of content here...</p>
        </div>,
      parentId: currentFolderId,
    })
    // 更新 当前文件夹下的 childIds
    const childIds = (folderSysteam.get(`${currentFolderId}`) as FolderSysteamType).childIds as number[]
    childIds && childIds.push(+size)
    setStorage(CURRENTCHILDIDS, childIds)
    setFolderSysteam(newFolderSysteam)
  }

  // 按向上🔼键
  function handleArrowUp() {
    setChangeCount(prev => Math.max(prev - 1, -commandHistory.length))
  }
  // 按向下🔽键
  function handleArrowDown() {
    setChangeCount(prev => Math.min(prev + 1, 0))
  }

  // 匹配历史 command 并补充
  const matchCommand = (inputValue: string): string | null => {
    // 遍历历史command 返回以当前输入 command 值开头(startsWith)的 command
    const matchedCommands = commandHistory.filter(command => command.startsWith(inputValue))
    return matchedCommands.length > 0 ? matchedCommands[matchedCommands.length - 1] : null
  }
  const commandList: CommandList = {
    cat,
    cd,
    clear,
    ls,
    help,
    mkdir,
    touch,
  }

  // 执行方法
  function executeCommand(event: React.KeyboardEvent<HTMLInputElement>, id: number) {
    const input = document.querySelector(`#terminal-input-${id}`) as HTMLInputElement
    const [cmd, args] = input.value.trim().split(' ')
    if (event.key === 'ArrowUp') {
      handleArrowUp()
    }
    else if (event.key === 'ArrowDown') {
      handleArrowDown()
    }
    else if (event.key === 'Tab') {
      event.preventDefault()
      const matchedCommand = matchCommand(input.value.trim())
      if (matchedCommand)
        input.value = matchedCommand
    }
    else if (event.key === 'Enter') {
      // 将新输入 command 加入 commandHistory 中
      const newArr = commandHistory
      newArr.push(input.value.trim())
      setCommandHistory(newArr)
      // 如果输入 command 符合就执行
      console.log('exe中',pwdInfo)
      if (cmd && Object.keys(commandList).includes(cmd))
        commandList[cmd](args)
      else if (cmd !== '')
        generateRow(<CommandNotFound key={key()} command={input.value.trim()} />)
      // 每次无论 command 符不符合，都需要生成一行新的 Row,并且 curentId++
      setCurrentId(id => id + 1)
      setTimeout(() => {
        generateRow(
        <Row
          key={key()}
          id={commandHistory.length}
          onkeydown={(e: React.KeyboardEvent<HTMLInputElement>) => executeCommand(e, commandHistory.length)}
        />,
        )
      }, 100)
    }
  }
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div className='relative w-[1500px] h-[1000px] flex flex-col mt-6' >
        {/* <div className='absolute w-full top-2 window-header'> */}
        {/*  <TrafficLight /> */}
        {/* </div> */}
        <div
            className="flex flex-col p-4 pr-[5px] h-full text-white bg-[#000] "
            style={{ fontSize: '15px' }}
        >
          <div className="flex flex-col flex-1 w-full mb-2 overflow-y-scroll scrollbar">
            <div>Design based on React 18.2.0</div>
            <br/>
            <div>Welcome to Tlog! Type `help` to get started. </div>
            <br/>
            <div>Here is the updating log:</div>
            <button onClick={()=>dispatch({type: 'add'})} >cur num: {pwdInfo.ids}</button>
            <button onClick={()=>dispatch({type: 'sub'})} >cur num: {numb.num}</button>
            <button onClick={onInce}>cur pwd length {pwdInfo.ids.length}</button>
            {logList.map(log => (
                <div key={log.lid}> * {log.summary}{log.time}</div>
            ))}
            <br/>
            <div>Current visit: {curTime} from 0.0.0.0
            </div>
            <div
                className='flex-1 w-full'
            >
              {...content}
            </div>
          </div>
        </div>
        {/* <div className='absolute bottom-0 w-full '> */}
        {/*  <BottomBar/> */}
        {/* </div> */}
      </div>
    </div>
  )
}

export default App
