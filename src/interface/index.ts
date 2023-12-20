export interface MenuType {
  mid: number
  name: string
  children: MenuType[] | undefined
}
export interface PwdType {
  ids: number[]
  path: string[]
}
