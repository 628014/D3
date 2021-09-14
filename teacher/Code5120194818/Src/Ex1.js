export default class Tree {
  constructor(id, data) {
    this.id = id;
    this.data = data;
    this.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    // 边框
    this.width = document.querySelector(`#${id}`).offsetWidth;
    this.height = document.querySelector(`#${id}`).offsetHeight;

    this.svg = null;
    this.mg = null;

    this.maxHeight = '100%';
    this.maxWidth = '100%';
    this.backgroundColor = '#eee';
    this.init();

  }
  init() {
    this.initSvg();
    this.initMainGroup();
    this.initZoom();
    return this;
  }
  initSvg() {
    this.svg = d3.select(`#${this.id}`)
      .append('svg');
    // 响应式盒子
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.viewBox = `0 0 ${this.width} ${this.height}`;
    this.svg.attr('id', `${this.id}svg`)
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


}