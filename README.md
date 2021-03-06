<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [D3](#d3)
- [前期说明](#前期说明)
- [D3 版本说明](#d3-版本说明)
- [实验一](#实验一)
  - [1. 实现内容](#1-a-namea实现内容)
    - [1.1. 绘制生命之树,结果如下：](#11-a-name-1a绘制生命之树结果如下)
    - [1.2. 绘制径向树图](#12-a-name-1a绘制径向树图)
- [实验二](#实验二)
  - [2. 方法](#2-a-name-1a方法)
    - [`d3.select() `:](#d3select)
    - [`Selection.append() `:](#selectionappend)
    - [`Selection.insert`:](#selectioninsert)
    - [`Selection.text`:](#selectiontext)
    - [`Selection.html`:](#selectionhtml)
    - [`Selection.style`](#selectionstyle)
    - [`Selection.classed`](#selectionclassed)
    - [`Selection.attr`](#selectionattr)
    - [`Slection.on`](#slectionon)
    - [`Selection.each`](#selectioneach)
    - [`Selection.call`](#selectioncall)
  - [3. 链式调用](#3-a-name-1a链式调用)
  - [4. 动态绑定数据](#4-a-name-1a动态绑定数据)
    - [4.1. enter ,updata, exit](#41-a-nameenterupdataexitaenter-updata-exit)
    - [4.2. join](#42-a-namejoinajoin)
    - [4.3. merge](#43-a-namemergeamerge)
  - [5. 深入理解数据绑定](#5-a-name-1a深入理解数据绑定)
    - [5.1. Selection.data](#51-a-nameselectiondataaselectiondata)
  - [6. 实验结果](#6-a-name-1a实验结果)
- [实验三](#实验三)
  - [7. 实现内容](#7-a-name-1a实现内容)
- [实验四](#实验四)
  - [实现效果](#实现效果)
  - [8. 交互事件](#8-a-name-1a交互事件)
    - [8.1. click](#81-a-nameclickaclick)
    - [8.2. mouseout + mouseover + mouseleave + mouseenter](#82-a-namemouseoutmouseovermouseleavemouseenteramouseout-mouseover-mouseleave-mouseenter)
    - [8.3. drag 拖拽](#83-a-namedragadrag-拖拽)
    - [8.4. zoom 缩放](#84-a-namezoomazoom-缩放)
    - [8.5. brushX + brushY 刷子](#85-a-namebrushxbrushyabrushx-brushy-刷子)
  - [9. 生成器](#9-a-name-1a生成器)
    - [9.1. 符号生成器](#91-a-name-1a符号生成器)
    - [9.2. 直线生成器 + 曲线生成器](#92-a-name-1a直线生成器-曲线生成器)
    - [9.3. 面积生成器](#93-a-name-1a面积生成器)
    - [9.4. 弧生成器](#94-a-name-1a弧生成器)
    - [9.5. pie 生成器](#95-a-namepieapie-生成器)

<!-- /code_chunk_output -->

# D3

D3 课程学习

# 前期说明

1. 代码上传
   由于更新了最新版的，所有不支持密码上传了，生成自己的 token 在进行连接  
   git remote set-url origin https://<your_token>@github.com/<USERNAME>/<REPO>.git

- your_token：换成你自己得到的 token
- USERNAME：是你自己 github 的用户名
- REPO：是你的仓库名称

2. 作业提交

- 作业布置后 3 天之类进行电子稿的提交
- 实验报告一两句话说清楚，写清思路，清晰的清楚路线，

3. [动态生成目录](https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/toc)
   你可以通过 `cmd-shift-p` 然后选择`Markdown Preview Enhanced: Create Toc`命令来创建`TOC`。 多个 TOCs 可以被创建。 如果你想要在你的 `TOC` 中排除一个标题，请在你的标题 后面 添加 {ignore=true} 即可。

# D3 版本说明

`D3` : D3.V7

`bootstrap` : 5.0.2

# 实验一

### 1. <a name=''></a>实现内容

#### 1.1. <a name='-1'></a>绘制生命之树,结果如下：

核心代码 ：

```js
import LifeTree from '../../../mi/lifeTree/LifeTree_5120194818.js'
d3.json('../../../mi/lifeTree/data_5120194818.json').then((data) => {
  let lifeTree = new LifeTree('lifeTree', data)
    .setColorKeys(['Bacteria', 'Eukaryota', 'Archaea'])
    .setMargin(150, 80, 150, 80)
    .init()
    .render()
})
```

![生命之树](./Resources/img/lifeTree.png)

#### 1.2. <a name='-1'></a>绘制径向树图

核心代码 ：

```js
import HorizontalTree from '../../../mi/tree/horizontal_tree_5120194818.js'
d3.json('../../../mi/tree/data_5120194818.json').then((data) => {
  let horizontalTree = new HorizontalTree('dTree', data)
    .setMargin(50, 50, 50, 50)
    .init()
    .render()
})
```

![径向树图](./Resources/img/horizontalTree.png)

# 实验二

### 2. <a name='-1'></a>方法

##### `d3.select() `:

select 执行时，会先检测传入参数的类型，如果是字符串，则帮我们执行 document.querySelector。返回的结果是一个 Selection 对象。

##### `Selection.append() `:

Selection.append()方法的功能是，向选定的元素中，追加一个 DOM 元素。
是通过原生的 appendChild()方法添加的新元素。

##### `Selection.insert`:

Selection.insert 的功能是，在指定的某个结点前，插入一个新的 DOM 元素。
是通过原生的 insertBefore()方法插入的新元素。

##### `Selection.text`:

Selection.text 的功能是：设置当前 Selection 对象包含所有的 DOM 元素的 innerText 属性。

##### `Selection.html`:

与 Selectio.text 同理。只是由修改 text 变成了修改 innerHTML

##### `Selection.style`

Selection.style 的功能是：设置当前 Selection 对象包含所有的 DOM 元素的 style 属性。

##### `Selection.classed`

Selection.classed 的功能：设置当前 Selection 对象包含所有的 DOM 元素的 class 属性。

##### `Selection.attr`

Selection.attr 的功能：设置当前 Selection 对象包含所有的 DOM 元素的属性。

##### `Slection.on`

Slection.on 的功能：为 DOM 元素添加监听事件。

底层是通过 addEventListener(),removeEventListener()对 DOM 元素进行事件监听的。

如果传递一个参数，则返回该属性的值。即.getAttribute()

如果传递两个参数，则设置该属性的值。即.setAttribute()

##### `Selection.each`

Selection.each 的功能：为 Selection 对象选定元素依次调用指定的函数，该函数为回调函数，Selection.each 内部会为调用该函数，并且为其传递 3 个参数：该 DOM 绑定的数据，该 Selection 选定的 DOM 数组中该 DOM 的下标，该 Selection 选定的 DOM 数组，并将其 this 指向作为当前 DOM 元素。 此方法可用于为每个选定的元素调用任意代码。

1. 为回调函数传递 3 个参数：该 DOM 绑定的数据，该 Selection 选定的 DOM 数组中当前 DOM 的下标，该 Selection 选定的 DOM 数组

2. 将该函数的 this 指向当前 DOM 元素。（回调函数是箭头函数时，该操作会失效）
   箭头函数不绑定 this，会根据作用域链，来确定 this 的指向。
   箭头函数，可以使用 call，apply 方法，但是仅改变参数，而无法改变 this。
   简而言之：箭头函数内的 this 值继承自外围作用域，且无法被改变。

##### `Selection.call`

Selection.call 的功能：完全调用一次指定的函数，并将此选择与任何可选参数一起传递。 返回此选择。 这等效于手动调用功能，但有助于方法链接。

### 3. <a name='-1'></a>链式调用

链式调用是基于 select 每次都返回一个新的 Selection 对象实现的

### 4. <a name='-1'></a>动态绑定数据

selection.data - bind elements to data.

selection.join - enter, update or exit elements based on data.

selection.enter - get the enter selection (data missing elements).

selection.exit - get the exit selection (elements missing data).

selection.datum - get or set element data (without joining).

深入理解数据绑定

我们绑定的数据，并不在 Selection 对象中。而是在结点中。我们绑定的数据，都存储在 DOM 结点上。d3.js 为绑定数据的结点，增加了一个叫**data**的属性。由于，数据一旦绑定，就会一直存在，所以数据是持久化的。相反，Selection 对象，可以认为是短暂的。
此外，由于数据的持久化的，所以我们可以从 DOM 中重新选择元素，它们将保留先前绑定到它们的任何数据。

能够绑定到元素上：

Selection.each 的功能：为 Selection 对象选定元素依次调用指定的函数，该函数为回调函数，Selection.each 内部会为调用该函数，并且为其传递 3 个参数：该 DOM 绑定的数据，该 Selection 选定的 DOM 数组中该 DOM 的下标，该 Selection 选定的 DOM 数组，并将其 this 指向作为当前 DOM 元素。 此方法可用于为每个选定的元素调用任意代码。因此，我们传入的函数，在内部会通过以下代码被调用。
callback.call(node, node.**data**, i, group);
这就是为什么我们可以通过回调函数使用绑定到 DOM 上数据的原因！！！

Selection.append,Selection.insert,Selection.select
实体 DOM 上绑定的数据，在通过 append、insert、select 操作后，是可以被继承的。而通过 selectAll 是无法继承的。

#### 4.1. <a name='enterupdataexit'></a>enter ,updata, exit

![](./Resources/img/data.png)

`updateSet.enter()` 是一个抽象的集合，(enternode)不含有实际的 DOM 元素，如果要加上数据，可以使用 append 来实现
`selection.exit().remove()` `exit()`多余的只是在页面上移除了，实际的结点还在

#### 4.2. <a name='join'></a>join

#### 4.3. <a name='merge'></a>merge

多个结构相同的选择集做相同的工作

### 5. <a name='-1'></a>深入理解数据绑定

#### 5.1. <a name='Selection.data'></a>Selection.data

Selection.data()：
功能：将数据按相关规则绑定到当前 Selection 对象已选定的中的 DOM 中。

参数一：数据，必须是一个可迭代的数组，每一个元素会被绑定到对应的 DOM 元素中。

参数二：绑定规则，即 Key。如果不传入该参数，默认按照数组的下标进行绑定。

返回值：返回一个全新的 Selection 对象。

Selection.data()的返回值，虽然是一个 Selection 对象，但该对象有一些特点。
该对象的\_groups 属性里面存储了我们数据和 DOM 元素重叠的部分。即\_groups 中存放了需要更新的结点。

此外与普通的 Selection 对象只有\_gorups,\_parents 不同。该 Selection 对象有 2 个新的属性：\_enter,\_exit。

- \_enter：数据绑定的过程中，data 方法内部会找出多余的数据项，多余了 N 个数据就意味着需要新增 N 个 DOM 元素，这些新增的 DOM 元素,就会存储到\_enter 属性中。Selection.enter()取到该属性的值，该方法的返回值是一个包含待添加结点的 Selection 对象。我们可以将这个待添加结点称呼为虚拟 DOM。对该虚拟 DOM 使用.append()方法，d3.js 就会帮助我们将对于的 DOM 元素添加到页面上。
- \_exit：数据绑定的过程中，data 方法内部会找出多余的 DOM 元素，多余了 N 个 DOM 元素，就意味着要删除这 N 个 DOM 元素，这些需要移除的 DOM 元素,就会被存储到\_exit 属性中,Selection.exit()取到该属性的值，该方法的返回值是一个包含待删除结点的 Selection 对象。对该对象使用.remove()，d3.js 就会帮助我们将其移除。

### 6. <a name='-1'></a>实验结果

完成动态绑定的柱状图

读取数据 ：

```js
const createBar = async () => {
  /**
   * 1.1 读取数据
   * 1.2 聚合数据
   * 1.3 转换数据
   */
  const nationData = await d3.csv('../../DataVisCode/Resources/data/nation.csv')
  const groupData = d3.groups(nationData, (d) => d['Year'])
  const data = groupData.map(([year, value]) =>
    Object.entries(value[0])
      .slice(1)
      .map((d) => ({
        year: +year,
        nation: d[0],
        value: +d[1],
      }))
  )
}
```

收获 ：

最开始学习的是 promise 的 then 方法，但是随着学习的过程中发现 async 相比较 promise 而言，更加简洁干净, 看起来像同步代码，并且提供错误处理的方法，避免了更多的嵌套，凸显了中间值，并且提高了代码的调试性能，所以转战使用 async/await;

绘制图形 ：

![柱状图](./Resources/img/bar.png)

# 实验三

### 7. <a name='-1'></a>实现内容

1. 完成动态散点图的绘制：

核心代码 ：

```js
  <script type="module">
    import Bubble from './bubble.js'
    // 读取数据
    const create = async () =>  {

      const data = await d3.csv(
        "../../DataVisCode/Resources/data/covid19.csv"
      );

      // 数据按照年份进行分组
      let groupData =  Array.from(d3.group(data, d => d.date), ([key, value]) => ({key, value}))
      let bubble = new Bubble('bubble', groupData);
      bubble.render();
    }
    let start = create();
  </script>
```

实现效果如下：

![柱状图](./Resources/img/bubble.png)

解决的问题 ：

| 关键问题                                                                                         | 解决办法                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. 数据含有 0，对于比例尺的选择，有一些比例尺是不能用的，并且我们要对 0 做特殊处理，否则就是 NAN | 在我设置我的 xScale 和 yScale 的时候，当对应的横轴和纵轴出现特殊值的时候，会出现 NAN 的情况，由于开始是使用对数或者指数比例尺，有一些范围是不能从 0 开始的，不然算出来就是负值了，所以在进行选择后，又结合视频，就做了 scaleLinear 比例尺，并且设置对应的+d[this.ylabe] == 0 为 0 的时候，返回对应的 0，其他是返回我比例尺后的值                                                    |
| 2. 比例尺的刻度表述                                                                              | 以前使用的刻度，基本没有对刻度尺进行设置，这次使用 ticks 和 tickFormat 来实现刻度设置和格式化，由于对于格式化不怎么熟悉，专门去查了官网文档，最终实现了视频的效果。                                                                                                                                                                                                                 |
| 3. 添加圆圈的时候，有课外作业实现格子的展示，所以想办法实现这个格子 line                         | 格子也就是 line，每一个刻度要对应一个 line，设置对应的颜色即可，我们知道 xAxisGroup 要实现 x 轴展示，就需要 call 上 d3.axisBottom(this.xScale)能在创建后进行绘制；同样，我们要实现绑定的白色 line，也需要 call 上对应的线条，在这里我使用下面的来实现格子.call(g => {g.selectAll("line").attr("stroke","white"); return g;})                                                        |
| 4. 实现数据更新，视图更新                                                                        | 我们这里，使用了 group 进行按照时间分组之后，得到对应的键是时间，值是各个国家的具体的数据的 json 对象，我们使用 index = 0 作为初始化，每一次渲染之后，在规定的时间执行 play（）函数，实现视图的更新，而 play 函数中，我们使用 index++来改变我每一次所取得的数据，不断的再执行 setDataIndex，再执行 render，实现更新。当 index 到达原数据的 length 的时候，clearInterval，得到结束。 |

# 实验四

主要讲 d3 的交互事件和生成器的问题

### 实现效果

![径向树图](./Resources/img/1.png)

### 8. <a name='-1'></a>交互事件

#### 8.1. <a name='click'></a>click

表示点击，使用方法如下 ：

```js
.attr('fill', 'steelblue')
.on('click', function () {
  d3.select(this).attr('fill', 'darkorange')
  //获取事件（此处为鼠标单击）发生的相对位置，绝对位置用 event.pageX 和 event.pageY 获取
  // 注意不能使用箭头函数，箭头函数会改变this的指向，这里会指向当前元素的父级元素，导致当前的this不是我选择的元素
  console.log(this);
  // console.log(d3.pointer(event))
  // console.log(event.pageX,event.pageY)
})
```

#### 8.2. <a name='mouseoutmouseovermouseleavemouseenter'></a>mouseout + mouseover + mouseleave + mouseenter

没有见过的是 mouseenter， 表示滑进去的时候，可以触发这个事件，
mouseenter 只检测进入，不检测元素里面的移动
mousemover 是可以检测移动

在这里举例了一个 toolTips，可以随之移动的 div，使用相对定位，开始设置为不可见，滑到的时候可见，即可实现动态移动

#### 8.3. <a name='drag'></a>drag 拖拽

使用的时候，会有 event 对象接收当前的位置，可以取出来做效果

```js
const svg = d3.select('svg')

const drag = d3
  .drag() //创建拖拽行为
  .on('drag', move) //绑定拖拽处理
function move() {
  let x = d3.pointer(event)[0]
  let y = d3.pointer(event)[1]

  d3.select(this).attr('transform', (d) => `translate(${x}, ${y})`)
}
```

#### 8.4. <a name='zoom'></a>zoom 缩放

缩放给出的例子:

```js
const zoom = d3
  .zoom() // 创建缩放行为
  .scaleExtent([1, 10]) // 10倍缩放
  .on('zoom', zoomHandler) // 缩放事件监听和处理，也可以直接放在这里面

svg
  .selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('r', r)
  .attr('fill', 'steelblue')
  .attr('transform', (d) => `translate(${d})`)
  .call(zoom)

function zoomHandler() {
  let transform = d3.zoomTransform(this)
  svg.attr(
    'transform',
    `translate(${transform.x},
    ${transform.y}) scale(${transform.k})`
  )
}
```

我平时自己写的例子 ：

```js
initZoom() { //拖拽
  this.svg
    .call(d3.zoom()
      .on('zoom', this.zoomed)
    )
}
zoomed = (event) => {
  this.mg.attr('transform', `translate(${event.transform.x},${event.transform.y}) scale(${event.transform.k})`)
}

```

#### 8.5. <a name='brushXbrushY'></a>brushX + brushY 刷子

当我设置某一块的刷子的时候，就需要设置如下 ：

```js
const brush = d3
  .brushX() //创建水平方向的一维刷取交互
  .extent([
    [0, 0],
    [width, height],
  ]) //设置或获取刷取操作的可刷取范围,鼠标在此范围内时为十字形状

g.call(brush)
```

当我如果想要动态的确定我的刷子的大小并且勾选的时候，设置如下：

```js
// 定义刷子
const brush = d3.brush().on('start brush end', brushed)
svg.call(brush)
// 相应函数
function brushed({ selection }) {
  let value = []
  if (selection) {
    // 返回刷取出来的selection
    console.log(selection)
    // 得到刷子勾选的范围，去判断在该范围内的点我们就可以标注成其他的颜色
    const [[x0, y0], [x1, y1]] = selection

    value = dot
      .style('stroke', 'steelblue')
      // 范围满足条件的
      .filter((d) => x0 <= x(d.x) && x(d.x) < x1 && y0 <= y(d.y) && y(d.y) < y1)
      .style('stroke', 'red')
      .data()
    // console.log(value)
  } else {
    dot.style('stroke', 'steelblue')
  }
}
```

.data() 方法不带参数时，返回选择集元素的数据组成的数组

data 方法不带参数时，返回绑定到 dom 上的数据**data**，

如果传，就是往 dom 结点上绑定数据，

如果第一次传参数了，那么第二次.data()的时候直接去获取对应 dom 上的数据

如果第一次没有传，但是我还是使用.data()的时候，必然要 undefined

例子如下 ：

```js
d3.select('div').data([1, 2, 3]).data() // [1, 2, 3]
d3.select('div').data() // 是undefined
```

### 9. <a name='-1'></a>生成器

所谓的生成器，都是去生成对应的 path，需要使用 d 属性来进行描述

#### 9.1. <a name='-1'></a>符号生成器

通过符号生成器，生成对应 path 属性，自动生成对应的 d 属性

核心代码

```js
const symbolGenerator = d3.symbol().size(36) //创建和配置符号生成器
const symbolScale = d3
  .scaleOrdinal(d3.symbols)
  .domain(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
// 绑定的都是path属性，所以我们要去设置d属性
svg
  .selectAll('path')
  .data(data)
  .enter()
  .append('path')
  .attr('transform', (d) => `translate(${d.x} ,${d.y})`)
  .attr('d', (d) => symbolGenerator.type(symbolScale(d.typeCode))())
  .attr('fill', 'none')
  .attr('stroke', (d) => d.typeColor)
  .attr('stroke-width', 2)
```

#### 9.2. <a name='-1'></a>直线生成器 + 曲线生成器

绘制直线 ，d3.line()，

绘制曲线 ，d3.line().curve()

```js
const lineGenerator = d3.line().curve(d3.curveCardinal)
```

一般有 d3.curveLinear / d3.curveStepAfter / d3.curveStepBefore / d3.curveStep / d3.curveNatural 等多类 curve，能形成不一样的曲线

在学习的过程中，注意到一种关于 call 的写法

```js
svg.append('g')
  .attr('transform', 'translate( 50, 450 )')
  .call(liner, data, d3.curveNatural, 'd3.curveNatural', textPos)
function liner(g, data, curve, text, pos) {
  .....
}

```

在这种写法里面，我使用过给 call 传对应的 selection，但是没有这么使用过，经过查看源码，发现是这样的，

```js
export default function {
  // 第一个参数为call方法, 第一个参数为传入的函数, 第二个之后为传入的函数的参数.
  // 传入参数的第一个值是当前的selection对象.
  var callback = arguments[0];
  arguments[0] = this;
  // 可变长的参数列表
  callback.apply(null,arguments);
  return this;
}
```

#### 9.3. <a name='-1'></a>面积生成器

面积生成器，也就是 d3.area()

使用方法 ：

```js
const areaGenerator = d3
  .area()
  .x((d) => d[0])
  // 传输第二个参数，一个一维数组的下标访问
  // 反应的是连个不规则的曲线
  .y0((d) => d[2])
  .y1((d) => d[1])
  // 绘制的曲线的形式是同一种曲线
  .curve(d3.curveCardinal)

svg
  .append('g')
  .append('path')
  .attr('d', areaGenerator(dataset))
  .attr('fill', d3.schemeCategory10[1])
  .attr('fill-opacity', 0.5)
```

.data() 绑定二维数组

#### 9.4. <a name='-1'></a>弧生成器

主要使用过画饼图

同样是根据生成的 path 来绘制，同样，使用 d 属性，都是对 path 操作

```js
const data = { startAngle: 0.6, endAngle: 2.6 }

const arc = d3
  .arc() //创建弧生成器
  .outerRadius(200) //设置弧生成器，此行设置外半径
  .innerRadius(0) //设置弧生成器，此行设置内半径
// .cornerRadius(10)//设置弧生成器，此行设置切片四个角为圆角

svg
  .append('g')
  .attr('transform', 'translate(200,200)')
  .append('path')
  .attr('fill', 'purple')
  .attr('d', arc(data))
```

#### 9.5. <a name='pie'></a>pie 生成器

绘制饼图的时候，我需要有个逻辑，就是需要我用 d3.pie 生成对应的实例化的饼图数据，也就是包括 data, endAngle, startAngle 等在内的所有的，之后，使用弧生成器，来利用上面的生成的东西来传 d 属性绘制饼图

所以对于一个饼图，我们应该有两个生成器，

d3.pie() 用来创建饼图生成器,用于将原始数据转换为圆弧数据，所以参数为 data

d3.arc() 创建弧生成器，根据对应的属性进行绘制圆弧了，所以参数为.attr('d', d => arc(d))

```js
const pie = d3
  .pie()
  .value((d) => d.value) // 此行设置数据访问方式
  .sort((d) => d) //此行设置排序(不是按rank值的大小，而是按照先后顺序),默认按数值大小排序,
  .padAngle(0.01) //设置饼图生成器，此行设置切片间隔

const pie_data = pie(dataset)
console.log(pie_data)

const arc = d3
  .arc() //创建弧生成器
  .outerRadius(200)
  .innerRadius(100)
  .cornerRadius(10) // 此行设置切片四个角为圆角

const slices = PieGroup.selectAll('path')
  .data(pie_data)
  .enter()
  .append('path')
  .attr('fill', (d, i) => colors(i))
  .attr('d', (d) => arc(d))
```

在最后一个例子当中，我们想要实现效果，也就是数字和角度的旋转是一样的，我们想到质心，只要两者是按照相同的，也就是给 text 组也要加上关于中心差值即可实现

```js
.attrTween("transform", function (d) {
    const start = {
        startAngle: 0,
        endAngle: 0
    };
    const interpolate = d3.interpolate(start, d);
    return function (t) {
        return `translate(${arc.centroid(interpolate(t))})`;
    };
});
```
