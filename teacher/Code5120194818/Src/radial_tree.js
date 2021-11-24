export default class RadialTree {
  constructor(id, data) {
    this.data = data;
    this.id = id;
    // 边框
    this.margin = {
      top: 150,
      right: 100,
      bottom: 150,
      left: 100
    };
    // 具体的宽高
    this.width = document.querySelector(`#${id}`).offsetWidth;
    this.height = document.querySelector(`#${id}`).offsetHeight;

    this.svg = null;
    this.mg = null;

    this.maxHeight = '100%';
    this.maxWidth = '100%';
    this.backgroundColor = '#2E2733';
    // 组别
    this.linesGroup = null;
    this.textGroup = null;
    this.circleGroup = null;
    // 过渡效果
    this.duration = 1000;
    this.transition = d3.transition().duration(this.duration).ease(d3.easeLinear);

    // 初始设置
    this.radius = this.width / 2;
    this.init();
  }
  init() {
    // 初始化标签
    this.initSvg();
    // 初始化主体部分
    this.initMainGroup();
    // 初始化组别
    this.initGroups();
    // 缩放
    this.initZoom();
    return this;
  }

  render() {
    this.renderData();
    this.renderLine();
    this.renderText();
    this.renderCircle();
    return this;
  }
  initSvg() {
    this.svg = d3.select(`#${this.id}`)
      .append('svg');
    // 响应式盒子
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.viewBox = `0 0 ${this.width} ${this.height}`;

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
  }
  initGroups() {
    // 线条组 ：
    this.linesGroup = this.mg.append('g')
      .attr('id', 'linesGroup')
      .attr('transform', `translate(${this.innerWidth / 2},${this.innerHeight / 2})`)
    // 文字组:
    this.textGroup = this.mg.append('g')
      .attr('id', 'textGroup')
      .attr('transform', `translate(${this.innerWidth / 2},${this.innerHeight / 2})`)
    // circle组:
    this.circleGroup = this.mg.append('g')
      .attr('id', 'circleGroup')
      .attr('transform', `translate(${this.innerWidth / 2},${this.innerHeight / 2})`)
    // 图例
    this.tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('text-anchor', 'middle')
      .text('')

    this.textStyle = this.textGroup
      .append('style')
      .text(`
        .link--active{
          stroke:white !important;
          stroke-width:5px;
          stroke-opacity :0.8;
        }
        .label--active{
          font-weight:bold;
        }
    `);

  }
  //拖拽
  initZoom() {
    this.svg
      .call(d3.zoom()
        .on('zoom', this.zoomed)
      )
  }
  zoomed = (event) => {
    this.mg.attr('transform', `translate(${event.transform.x},${event.transform.y}) scale(${event.transform.k})`)
  }

  renderData() {
    this.tree = d3.cluster().size([2 * Math.PI, this.radius - 200])
    console.log(this.data)
    this.root = this.tree(d3.hierarchy(this.data)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name)));
    console.log(this.root)
  }
  renderLine() {
    this.linesGroup.selectAll('path')
      .data(this.root.links())
      .join('path')
      .each(function (d) {
        d.target.linkExtensionNode = this;
      })
      .transition()
      .attr('d', d3.linkRadial().angle(d => d.x).radius(d => d.y))
      .attr('fill', 'none')
      .attr('stroke', '#999999')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', '3px')
  }
  renderText() {
    this.textGroup.selectAll('text')
      .data(this.root.descendants())
      .join(enter => enter
        .append('text')
        .on('click', this.click)
        .style('cursor', 'pointer')
        .style('font-size', '10px')
        .style('fill', '#eee')
        .style('cursor', 'pointer'),
        update => update,
        exit => exit.remove()
      )

      .transition()
      .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr('x', d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr('text-anchor', d => d.x < Math.PI === !d.children ? 'start' : 'end')
      .text(d => d.data.name)
  }
  renderCircle() {
    this.circleGroup
      .selectAll('circle')
      .data(this.root.descendants())
      .join('circle')
      .on('click', this.click)
      .attr('r', '6px')
      .attr('stroke', '#fff')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', '2.5px')
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        this.tooltip.style('visibility', 'visible')
          .style('left', `${event.pageX +  40 + 'px'}`)
          .style('top', `${event.pageY  + 'px'}`)
          .style('opacity', 0.5)
          .style('color', '#EA5151')
          .style('font-size', '1rem')
          .style('font-weight', 900)
          .text(d.data.name)
      })
      .on('mouseout', (event, d) => {
        this.tooltip.style('visibility', 'hidden')

      })
      // .on('mouseover', mouseovered(true))
      // .on('mouseout', mouseovered(false))
      .transition()
      .attr('fill', d => d.data.children ?
        '#ff6768' :
        d.data._children ?
        '#2694ab' :
        '#263859')

      .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)


    function mouseovered(active) {
      return function (event, d) {
        d3.select(this).classed('label--active', active);
        do d3.select(d.linkExtensionNode)
          .classed('link--active', active)
          .raise();
        while (d = d.parent);

      }
    }
  }
  click = (e) => {
    let d = e.target.__data__;
    console.log(d)
    if (d.data._children) {
      d.data.children = d.data._children;
      d.data._children = null;
    } else {
      d.data._children = d.data.children;
      d.data.children = null;
    }
    this.render()
  }
  setMargin(top, right, bottom, left) {
    this.margin.top = top;
    this.margin.right = right;
    this.margin.bottom = bottom;
    this.margin.left = left;
    return this;
  }
}