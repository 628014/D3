export default class Bubble {
  constructor(id, data) {
    this.id = id;
    this.data = data;

    // x ，y轴标签 x 是治愈人数， y轴是死亡人数
    this.xlabe = 'recovered';
    this.ylabe = 'death';
    // 半径
    this.rlabel = 'confirmed';
    // 颜色
    this.colorLable = 'country';
    // 日期下标索引
    this.index = 0;
    // 根据下标取得这天的所有国家的数据
    this.indexData = data[this.index];
    console.log(this.indexData)

    // 边框
    this.margin = {
      top: 60,
      right: 200,
      bottom: 150,
      left: 100
    };
    this.width = document.querySelector(`#${id}`).offsetWidth;
    this.height = document.querySelector(`#${id}`).offsetHeight;

    this.svg = null;
    this.mg = null;

    this.maxHeight = '100%';
    this.maxWidth = '100%';
    this.backgroundColor = '#eee';
    // 组别
    this.xAxisGroup = null;
    this.yAxisGroup = null;
    this.circleGroup = null;
    // 过渡效果
    this.transition = d3.transition().duration(1000).ease(d3.easeLinear);
    this.duration = 250;
    this.init();


  }
  init() {
    // 初始化标签
    this.initSvg();
    // 初始化主体部分
    this.initMainGroup();
    // 初始化组别
    this.initGroups();
    // 初始化比例尺
    this.initScale();
    // 缩放
    this.initZoom();
    // 动态绑定
    this.play();
    return this;
  }
  // 更新
  render() {
    // 更新气泡
    this.rederBubbleAndText();
    // 更新坐标轴
    this.renderAxis();

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
    // X轴组 ：
    this.xAxisGroup = this.mg.append('g')
      .attr('id', 'xAxisGroup')
      .attr('transform', `translate(${this.margin.left},${this.margin.top + this.innerHeight})`);
    // y轴组:
    this.yAxisGroup = this.mg.append('g')
      .attr('id', 'yAxisGroup')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    // circle组:
    this.circleGroup = this.mg.append('g')
      .attr('id', 'circleGroup')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
    // 国家名组
    this.textGroup = this.mg.append('g')
      .attr('id', 'textGroup')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
    // 下标签组
    this.LegendButtom = this.mg.append('text')
      .attr('id', `${this.xlabe}` + 'text')
      .attr('transform', `translate(${(this.innerWidth + this.margin.right) / 2},${this.innerHeight + this.margin.top + 50})`)
      .style('font-weight', 900)
      .style('font-size', '20px')
      .text(`${this.xlabe}`);
    // 左标签组
    this.LegendLeft = this.mg.append('text')
      .attr('id', `${this.ylabe}` + 'text')
      .attr('transform', `translate(${(this.margin.left - 10) / 2},${(this.margin.top + this.innerHeight) / 2})` + 'rotate(-90)')
      .style('font-weight', 900)
      .style('font-size', '20px')
      .text(`${this.ylabe}`);
    // 时间展现组
    this.time = this.mg.append('text')
      .attr('id', 'timeShow')
      .attr('transform', `translate(${(this.margin.left + this.innerWidth) / 2},${(this.margin.top + this.innerHeight) / 2})`)
      .style('font-size', '5rem')
      .style('opacity', 0.3)
      .text(null)
  }
  initScale() {
    // 半径比例尺
    this.rScale = d3.scaleSqrt([0, 2e10], [5, this.innerWidth])
    // 颜色比例尺 :取出所有的国家进行映射
    let allCountry = [];
    this.data.map((d, i) => {
      allCountry.push(d.country)
    })

    this.colorScale = d3.scaleOrdinal()
      .domain(allCountry)
      .range(d3.schemeSet3)
    // 求出人数最多的用来固定比例尺
    let max_x = 0;
    let max_y = 0;
    this.data.map((d, i) => {
      max_x = max_x > d3.max(d.value, d => +d[this.xlabe]) ? max_x : d3.max(d.value, d => +d[this.xlabe])
      max_y = max_y > d3.max(d.value, d => +d[this.ylabe]) ? max_x : d3.max(d.value, d => +d[this.ylabe])

    });
    console.log(max_x)
    console.log(max_y)

    this.xScale = d3.scaleLinear()
      .domain([0, max_x])
      .range([0, this.innerWidth])
      .nice()
    this.yScale = d3.scaleLinear()
      .domain([0, max_y])
      .range([this.innerHeight, 0])
      .nice()
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
  play() {
    this.interval = setInterval(() => {
      if (++this.index === this.data.length) {
        clearInterval(this.interval);
        return;
      }
      let stringList = this.data[this.index].key.split('/')
      this.time.text('20' + `${stringList[2]}` + '.' + `${stringList[0]}`)
      this.setDataIndex(this.index);
      this.render(); //更新图表
    }, this.duration * 2)


  }
  setDataIndex(index) {
    this.index = index;
    this.indexData = this.data[this.index];
    console.log(this.indexData)
  }

  rederBubbleAndText() {
    this.circleGroup.selectAll('circle')
      .data(this.indexData.value, d => {
        d[this.colorLable]
      })
      .join(
        enter => enter.append('circle')
        .attr("cy", this.innerHeight)
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .style('stroke-width', '2.5px')
        .style('stroke', '#fff'),
        update => update,
        exit => exit.remove()
      )
      .attr('r', d => this.rScale(+d[this.rlabel]))
      .attr('cx', d => {
        console.log(this.xScale(+d[this.xlabe]))
        if (+d[this.xlabe] == 0) return 0
        else return this.xScale(+d[this.xlabe])
      })
      // 
      .attr('cy', d => {
        if (+d[this.ylabe] == 0) return 0;
        else return this.yScale(+d[this.ylabe])

      })
      .attr('fill', d => this.colorScale(d[this.colorLable]))



    this.textGroup.selectAll('text')
      .data(this.indexData.value, d => {
        d[this.colorLable]
      })
      .join('text')
      .text(d => d[this.colorLable])
      .attr("text-anchor", "start")
      .attr("font-size", d => this.rScale(+d[this.rlabel]) - 5)
      .attr("x", d => {
        if (+d[this.xlabe] == 0) return 0
        else return this.xScale(+d[this.xlabe]) - 15
      })
      .attr("y", d => {
        if (+d[this.ylabe] == 0) return 0;
        else return this.yScale(+d[this.ylabe])
      })

  }


  renderAxis() {
    this.xAxisGroup
      .call(d3.axisBottom(this.xScale)
        .tickSizeInner(`-${this.innerHeight}`)
        .ticks(7)
        .tickFormat(d3.format(".2s"))
      )
      .call(g => {
        g.selectAll("line").attr("stroke", "white");
        return g;
      })
      .selectAll('g text')
      .attr('y', 10)
      .attr("x", 10)
      .attr('font-size', '1em')
      .attr('font-weight', 900)

    this.yAxisGroup
      .call(d3.axisLeft(this.yScale)
        .tickSizeInner(`-${this.innerWidth}`)
        .ticks(6)
        .tickFormat(d3.format(".2s"))

      )
      .call(g => {
        g.selectAll("line").attr("stroke", "white");
        return g;
      })
      .selectAll('g text')
      .attr('font-size', '1em')
      .attr('font-weight', 900)
      .attr('x', '-10')
  }



  setMargin(top, right, bottom, left) {
    this.margin.top = top;
    this.margin.right = right;
    this.margin.bottom = bottom;
    this.margin.left = left;
    return this;
  }

}

/**
 * 
 * 1. 平滑过渡效果
 * 2. death的移动 ok 
 * 3. 文字的添加 ok 
 */