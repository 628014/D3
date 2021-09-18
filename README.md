# D3
D3课程学习

# 前期说明

1. 代码上传
由于更新了最新版的，所有不支持密码上传了，生成自己的token在进行连接   
git remote set-url origin https://<your_token>@github.com/<USERNAME>/<REPO>.git
- your_token：换成你自己得到的token
- USERNAME：是你自己github的用户名
- REPO：是你的仓库名称
2. 作业提交
- 作业布置后3天之类进行电子稿的提交
- 实验报告一两句话说清楚，写清思路，清晰的清楚路线，
# D3版本说明
`D3` : D3.V7

`bootstrap` : 5.0.2
# 实验1 


### 实现内容

#### 1. 绘制生命之树,结果如下：
   
   核心代码 ：
   ```js
   import LifeTree from '../../../mi/lifeTree/LifeTree_5120194818.js' 
   d3.json('../../../mi/lifeTree/data_5120194818.json').then((data) =>{
        let lifeTree = new LifeTree('lifeTree',data)
        .setColorKeys(["Bacteria", "Eukaryota", "Archaea"])
        .setMargin(150, 80, 150, 80)
        .init()
        .render();
    })
   ```
![生命之树](../D3/mi/Resources/img/lifeTree.png)

#### 2. 绘制径向树图
 核心代码 ：
   ```js
  import HorizontalTree from '../../../mi/tree/horizontal_tree_5120194818.js'
   d3.json('../../../mi/tree/data_5120194818.json').then((data) =>{
      let horizontalTree = new HorizontalTree('dTree',data).setMargin(50, 50, 50, 50)
        .init()
        .render();
    })
   ```  

![径向树图](../D3/mi/Resources/img/horizontalTree.png)


   
# 实验二

