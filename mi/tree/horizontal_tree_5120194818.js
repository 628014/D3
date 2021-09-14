export default class HorizontalTree {
  constructor(id, data) {

    this.data = data;
    this.id = id;

    this.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    this.width = document.querySelector(`#${id}`).offsetWidth;
    this.height = document.querySelector(`#${id}`).offsetHeight;

    this.svg = null;
    this.mg = null;

    this.maxHeight = '100%';
    this.maxWidth = '100%';
    this.backgroundColor = '#eee';


  }

  init() {
    //初始化svg
    this.initSvg();
    //初始化主题内容部分
    this.initMainGroup();
    //初始化容器
    this.initTreeGroup();
    //拖拽
    this.initZoom();
    return this;
  }

  initSvg() {
    this.svg = d3.select(`#${this.id}`)
      .append('svg');

    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.viewBox = `0 0 ${this.width} ${this.height}`; //响应式视图盒子

    this.svg
      .attr('id', `${this.id}svg`)
      .attr('viewBox', this.viewBox)
      .style('background-color', this.backgroundColor)
      .style('max-height', this.maxHeight)
      .style('max-width', this.maxWidth)
  }

  initMainGroup() {
    this.mg = this.svg.append('g')
      .attr('id', `${this.id}MainGroup`)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    console.log(this.margin.left);
  }

  setMargin(top, right, bottom, left) {
    this.margin.top = top;
    this.margin.right = right;
    this.margin.bottom = bottom;
    this.margin.left = left;
    return this;
  }


  initTreeGroup() {
    this.treePathGroup = this.mg.append('g').attr('class', 'pathGroup');
    this.treeCircleGroup = this.mg.append('g').attr('class', 'circleGroup');
    this.treeTextGroup = this.mg.append('g').attr('class', 'textGroup');
  }

  initZoom() {
    this.svg.call(d3.zoom()
      .on('zoom', this.zoomed)
    )
  }

  render(data) {
    if (data) {
      this.data = data;
    }
    //更新数据
    this.renderData();
    //更新Path
    this.renderTreePath();
    //更新Circle
    this.renderTreeCircle();
    //更新Text
    this.renderTreeText();
    return this;
  }

  renderData() {
    //第一次数据预处理，给每个节点添加了 height depth parent 属性
    this.targetData = d3.hierarchy(this.data)
      .sum(d => d.value);
    console.log(this.targetData)
    //创建树模型生成器,进行设置
    d3.tree()
      .size([this.innerHeight, this.innerWidth])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)(this.targetData);
    console.log(this.targetData.links())
  }

  renderTreePath() {
    this.treePathGroup
      .selectAll("path")
      .data(this.targetData.links(), d => d.target.data.id)
      .join('path')
      .transition()
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr("fill", "none")
      .attr("stroke", "#6b778d")
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", '1.5px')
  }

  renderTreeCircle() {
    this.treeCircleGroup
      .selectAll("circle")
      .data(this.targetData.descendants(), d => d.data.id)
      .join(enter => enter
        .append('circle')
        .attr('r', '8px')
        .attr('stroke', '#fff')
        .attr('stroke-width', '2.5px')
        .style('padding', '2.5px')
        .style("cursor", "pointer"),
        update => update,
        exit => exit.remove()
      )
      .on('click', this.mouseclick)
      .transition(this.transition)
      .attr("fill", d => d.data.children ?
        "#ff6768" :
        d.data._children ?
        "#2694ab" :
        "#263859")
      .attr("transform", d => `translate(${d.y}, ${d.x})`)
  }

  renderTreeText() {
    this.texts = this.treeTextGroup.selectAll("text")
      .data(this.targetData.descendants(), d => d.data.id)
      .join(enter => enter
        .append('text')
        .style("cursor", "pointer")
        .style("fill", "#000")
        .style("font-size", "10px")
        .style("cursor", "pointer"),
        update => update,
        exit => exit.remove()
      )
      .on('click', this.mouseclick)
      .transition()
      .attr("transform", d => `translate(${d.y}, ${d.x})`)
      .attr("x", d => d.x < Math.PI === !d.children ? 10 : 10)
      .text(d => d.data.name.length > 10 ? d.data.name.slice(0, 4) + "..." : d.data.name)
  }

  mouseclick = (e) => {
    let d = e.target.__data__;
    //如果要隐藏，则将子节点保存到一个临时属性中
    //如果要展开，则从临时属性中取值
    if (d.data._children) {
      d.data.children = d.data._children;
      d.data._children = null;
    } else {
      d.data._children = d.data.children;
      d.data.children = null;
    }
    //设置新的目标数据，数据一变动，则更新视图
    this.render()
  }

  // 伸缩函数
  zoomed = (event) => {
    this.mg.attr('transform', `translate(${event.transform.x},${event.transform.y}) scale(${event.transform.k})`)
  }
}