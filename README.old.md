# 坦克大战 技术方案

## 架构设计：

MVC 结构

modal:

游戏地图为 x*y 的长方形 -> 映射到一张 y * x 的二维数组上，数组的元素即为每一块元素

view:

将二维数组渲染成 x * y 的长方形

controller:

接受 IO，修改 modal 二维数组的值

## 实现思路

modal:

redux slice 创建二维数组

[type define](type.ts)

view:

