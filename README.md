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

### 1. 方法

##### 1.1 `d3.select() `: 

select执行时，会先检测传入参数的类型，如果是字符串，则帮我们执行document.querySelector。返回的结果是一个Selection对象。

##### 1.2 `Selection.append() `: 
Selection.append()方法的功能是，向选定的元素中，追加一个DOM元素。
是通过原生的appendChild()方法添加的新元素。
##### 1.3 `Selection.insert`:
Selection.insert的功能是，在指定的某个结点前，插入一个新的DOM元素。
是通过原生的insertBefore()方法插入的新元素。
##### 1.4 `Selection.text`:
Selection.text的功能是：设置当前Selection对象包含所有的DOM元素的innerText属性。
##### 1.5 `Selection.html`:
与Selectio.text同理。只是由修改text变成了修改innerHTML 
##### 1.6 `Selection.style`
Selection.style的功能是：设置当前Selection对象包含所有的DOM元素的style属性。
##### 1.7 `Selection.classed`
Selection.classed的功能：设置当前Selection对象包含所有的DOM元素的class属性。
##### 1.8 `Selection.attr`
Selection.attr的功能：设置当前Selection对象包含所有的DOM元素的属性。

##### 1.9 `Slection.on`

Slection.on的功能：为DOM元素添加监听事件。

底层是通过addEventListener(),removeEventListener()对DOM元素进行事件监听的。

如果传递一个参数，则返回该属性的值。即.getAttribute()

如果传递两个参数，则设置该属性的值。即.setAttribute()

##### 1.10 `Selection.each`

Selection.each的功能：为Selection对象选定元素依次调用指定的函数，该函数为回调函数，Selection.each内部会为调用该函数，并且为其传递3个参数：该DOM绑定的数据，该Selection选定的DOM数组中该DOM的下标，该Selection选定的DOM数组，并将其this指向作为当前DOM元素。 此方法可用于为每个选定的元素调用任意代码。


1. 为回调函数传递3个参数：该DOM绑定的数据(后续会讲到)，该Selection选定的DOM数组中当前DOM的下标，该Selection选定的DOM数组

2. 将该函数的this指向当前DOM元素。（回调函数是箭头函数时，该操作会失效）
 箭头函数不绑定this，会根据作用域链，来确定this的指向。
 箭头函数，可以使用call，apply方法，但是仅改变参数，而无法改变this。
 简而言之：箭头函数内的this值继承自外围作用域，且无法被改变。

##### 1.11 `Selection.call`

Selection.call的功能：完全调用一次指定的函数，并将此选择与任何可选参数一起传递。 返回此选择。 这等效于手动调用功能，但有助于方法链接。 

### 2. 链式调用

链式调用是基于select每次都返回一个新的Selection对象实现的


### 3. 动态绑定数据

selection.data - bind elements to data.

selection.join - enter, update or exit elements based on data.

selection.enter - get the enter selection (data missing elements).

selection.exit - get the exit selection (elements missing data).

selection.datum - get or set element data (without joining).



深入理解数据绑定

我们绑定的数据，并不在Selection对象中。而是在结点中。我们绑定的数据，都存储在DOM结点上。d3.js为绑定数据的结点，增加了一个叫__data__的属性。由于，数据一旦绑定，就会一直存在，所以数据是持久化的。相反，Selection对象，可以认为是短暂的。
此外，由于数据的持久化的，所以我们可以从DOM中重新选择元素，它们将保留先前绑定到它们的任何数据。

能够绑定到元素上：

Selection.each的功能：为Selection对象选定元素依次调用指定的函数，该函数为回调函数，Selection.each内部会为调用该函数，并且为其传递3个参数：该DOM绑定的数据，该Selection选定的DOM数组中该DOM的下标，该Selection选定的DOM数组，并将其this指向作为当前DOM元素。 此方法可用于为每个选定的元素调用任意代码。因此，我们传入的函数，在内部会通过以下代码被调用。
callback.call(node, node.__data__, i, group);
这就是为什么我们可以通过回调函数使用绑定到DOM上数据的原因！！！

Selection.append,Selection.insert,Selection.select 
实体DOM上绑定的数据，在通过append、insert、select操作后，是可以被继承的。而通过selectAll是无法继承的。
#### 3.1 enter ,updata, exit 

![](../D3/mi/Resources/img/data.png)

`updateSet.enter()` 是一个抽象的集合，(enternode)不含有实际的DOM元素，如果要加上数据，可以使用append来实现
`selection.exit().remove()` `exit()`多余的只是在页面上移除了，实际的结点还在
#### 3.2 join


#### 3.3 merge

多个结构相同的选择集做相同的工作


### 4. 深入理解数据绑定

#### Selection.data

Selection.data()：
功能：将数据按相关规则绑定到当前Selection对象已选定的中的DOM中。

参数一：数据，必须是一个可迭代的数组，每一个元素会被绑定到对应的DOM元素中。

参数二：绑定规则，即Key。如果不传入该参数，默认按照数组的下标进行绑定。

返回值：返回一个全新的Selection对象。

Selection.data()的返回值，虽然是一个Selection对象，但该对象有一些特点。
该对象的_groups属性里面存储了我们数据和DOM元素重叠的部分。即_groups中存放了需要更新的结点。


此外与普通的Selection对象只有_gorups,_parents不同。该Selection对象有2个新的属性：_enter,_exit。


- _enter：数据绑定的过程中，data方法内部会找出多余的数据项，多余了N个数据就意味着需要新增N个DOM元素，这些新增的DOM元素,就会存储到_enter属性中。Selection.enter()取到该属性的值，该方法的返回值是一个包含待添加结点的Selection对象。我们可以将这个待添加结点称呼为虚拟DOM。对该虚拟DOM使用.append()方法，d3.js就会帮助我们将对于的DOM元素添加到页面上。
- _exit：数据绑定的过程中，data方法内部会找出多余的DOM元素，多余了N个DOM元素，就意味着要删除这N个DOM元素，这些需要移除的DOM元素,就会被存储到_exit属性中,Selection.exit()取到该属性的值，该方法的返回值是一个包含待删除结点的Selection对象。对该对象使用.remove()，d3.js就会帮助我们将其移除。


### 5. 实验结果

完成动态绑定的柱状图
   
   读取数据 ：
   ```js
     const createBar = async () => {
      /**
       * 1.1 读取数据
       * 1.2 聚合数据
       * 1.3 转换数据
       */
      const nationData = await d3.csv(
        "../../DataVisCode/Resources/data/nation.csv"
      );
      const groupData = d3.groups(nationData, (d) => d["Year"]);
      const data = groupData.map(([year, value]) =>
        Object.entries(value[0])
        .slice(1)
        .map((d) => ({
          year: +year,
          nation: d[0],
          value: +d[1],
        }))
      );
   }

   ```
   收获 ：

   最开始学习的是promise的then方法，但是随着学习的过程中发现async 相比较promise而言，更加简洁干净, 看起来像同步代码，并且提供错误处理的方法，避免了更多的嵌套，凸显了中间值，并且提高了代码的调试性能，所以转战使用async/await;

   绘制图形 ：

![柱状图](../D3/mi/Resources/img/bar.png)


# 实验3

