export default class LifeTree {
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
    this.radius = null
    this.root = null;
    this.legend = null;
    this.color = null;
    //外部线
    this.linkExtension = null;
    this.linkExtensionElements = null;
    //内部线
    this.link = null;
    this.linkElements = null;

    this.show = false;
    this.innerLinkGroup = null;
    this.outerLinkGroup = null;
    this.textGroup = null;
    this.textStyle = null;
  }


  init() {
    this.initSvg();
    this.initMainGroup();
    this.initLegendGroup();
    this.initGroups();
    this.initRadius();
    this.initZoom();
    return this;
  }

  render(data) {
    if (data) {
      this.data = data;
    }
    this.renderData(); // 更新数据
    this.renderLegend(); // 图例
    this.renderLink(); //画短线
    this.renderLinkExtension(); //画长线
    this.renderText(); //画字体
    return this;
  }

  update(checked) {
    const t = d3.transition().duration(750);
    this.linkExtensionElements.transition(t).attr("d", checked ? this.linkExtensionVariable.bind(this) : this.linkExtensionConstant.bind(this));
    this.linkElements.transition(t).attr("d", checked ? this.linkVariable.bind(this) : this.linkConstant.bind(this));
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

  setColorKeys(arr) {
    this.colorKeys = arr;
    return this;
  }

  initMainGroup() {
    this.mg = this.svg.append('g')
      .attr('id', `${this.id}MainGroup`)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  setMargin(top, right, bottom, left) {
    this.margin.top = top;
    this.margin.right = right;
    this.margin.bottom = bottom;
    this.margin.left = left;
    return this;
  }

  initRadius() {
    this.radius = (this.innerHeight < this.innerWidth ? this.innerHeight : this.innerWidth) / 2;
  }
  initLegendGroup() {
    this.legendGroup = this.svg.append('g').attr('id', `${this.id}LegendGroup`);
  }
  initGroups() {
    this.innerLinkGroup = this.mg.append("g")
      .attr("id", `${this.id}InnerLinkGroup`)
      .attr("transform", `translate(${this.innerWidth / 2},${this.innerHeight / 2})`)
      .attr("fill", "none")
      .attr("stroke", "#000");

    this.outerLinkGroup = this.mg.append("g")
      .attr("id", `${this.id}OuterLinkGroup`)
      .attr("transform", `translate(${this.innerWidth / 2},${this.innerHeight / 2})`)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.25);

    this.textGroup = this.mg.append("g")
      .attr("id", `${this.id}TextGroup`)
      .attr("transform", `translate(${this.innerWidth / 2},${this.innerHeight / 2})`);

    this.textStyle = this.textGroup
      .append("style")
      .text(`
        .link--active{
          stroke:grey !important;
          stroke-width:1.5px;
        }
        .link-extension--active{
          stroke-opacity:0.6;
        }
        .label--active{
          font-weight:bold;
        }
    `);
  }

  renderData() {
    this.renderCluster();
    this.renderColor();
  }

  renderCluster() {
    this.root = d3.hierarchy(this.data, d => d.branchset)
      .sum(d => d.branchset ? 0 : 1)
      .sort((a, b) => (a.value - b.value) || d3.ascending(a.data.length, b.data.length));

    d3.cluster()
      .size([360, this.radius])
      .separation((a, b) => 1)(this.root)

    setRadius(this.root, this.root.data.length = 0, this.radius / maxLength(this.root));

    function maxLength(d) {
      return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
    }

    function setRadius(d, y0, k) {
      d.radius = (y0 += d.data.length) * k;
      if (d.children) d.children.forEach(d => setRadius(d, y0, k));
    }
  }

  initCheckedBox() {
    d3.select(`#${this.id}`).append('input').attr('type', 'checkbox').on('change', (event) => {
      this.update(this.show = !this.show)
    })
    d3.select(`#${this.id}`).append('span').text('Show branch length');
  }

  renderColor() {
    this.color = d3.scaleOrdinal()
      .domain(this.colorKeys)
      .range(d3.schemeCategory10)

    const setColor = (d) => {
      let name = d.data.name;
      d.color = this.color.domain()
        .indexOf(name) >= 0 ?
        this.color(name) :
        d.parent ?
        d.parent.color :
        null;
      if (d.children) d.children.forEach(setColor);
    }
    setColor(this.root);
  }

  renderText() {
    this.textGroupElements = this.textGroup
      .selectAll("text")
      .data(this.root.leaves())
      .join("text")
      .attr("dy", ".31em")
      .attr("transform", d => `rotate(${d.x - 90}) translate(${this.radius + 4},0)${d.x < 180 ? "" : " rotate(180)"}`)
      .attr("text-anchor", d => d.x < 180 ? "start" : "end")
      .text(d => d.data.name.replace(/_/g, " "))
      .attr("font-family", 'Calibri Light')
      .attr("font-size", '13px')
      .on("mouseover", mouseovered(true))
      .on("mouseout", mouseovered(false));

    function mouseovered(active) {
      return function (event, d) {
        d3.select(this).classed("label--active", active);
        d3.select(d.linkExtensionNode)
          .classed("link-extension--active", active)
          .raise();
        do d3.select(d.linkNode)
          .classed("link--active", active)
          .raise();
        while (d = d.parent);
      }
    }
  }

  renderLegend() {
    this.legend = this.legendGroup.selectAll("g")
      .data(this.color.domain())
      .join("g")
      .attr("transform", (d, i) => `translate(${0},${i * 20})`);
    this.legendRects = this.legend.selectAll("rect")
      .data(d => [d])
      .join('rect')
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", this.color)
    this.legendText = this.legend.selectAll('text')
      .data(d => [d])
      .join('text')
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(d => d)
  }
  //短线
  renderLink() {
    this.linkElements = this.innerLinkGroup
      .selectAll("path")
      .data(this.root.links())
      .join("path")
      .each(function (d) {
        d.target.linkNode = this;
      })
      .attr("d", d => this.linkConstant(d))
      .attr("stroke", d => d.target.color);
  }
  //长线
  renderLinkExtension() {
    this.linkExtensionElements = this.outerLinkGroup
      .selectAll("path")
      .data(this.root.links().filter(d => !d.target.children)) //过滤undefined
      .join("path")
      .each(function (d) {
        d.target.linkExtensionNode = this;
      })
      .attr("d", d => this.linkExtensionConstant(d));
  }
  linkConstant(d) {
    return this.linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
  }
  linkExtensionConstant(d) {
    return this.linkStep(d.target.x, d.target.y, d.target.x, this.radius);
  }
  linkVariable(d) {
    return this.linkStep(d.source.x, d.source.radius, d.target.x, d.target.radius);
  }
  linkExtensionVariable(d) {
    return this.linkStep(d.target.x, d.target.radius, d.target.x, this.radius);
  }
  linkStep(startAngle, startRadius, endAngle, endRadius) {
    const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
    const s0 = Math.sin(startAngle);
    const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
    const s1 = Math.sin(endAngle);
    return "M" + startRadius * c0 + "," + startRadius * s0 +
      (endAngle === startAngle ? "" : "A" + startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) + " " + startRadius * c1 + "," + startRadius * s1) +
      "L" + endRadius * c1 + "," + endRadius * s1;
  }

  initZoom() { //拖拽
    this.svg
      .call(d3.zoom()
        .on('zoom', this.zoomed)
      )
  }
  zoomed = (event) => {
    this.mg.attr('transform', `translate(${event.transform.x},${event.transform.y}) scale(${event.transform.k})`)
  }
}