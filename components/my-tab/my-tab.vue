<template>
  <view class="tab-container">
    <view class="tab-box">
      <scroll-view
        id="_scroll"
        scroll-x
        class="scroll-view"
        scroll-with-animation
        :scroll-left="scrollLeft"
      >
        <view class="scroll-content">
          <view class="tab-item-box">
            <!--  -->
            <block v-for="(item, index) in tabList" :key="index">
              <view
                class="tab-item"
                :id="'_tab_' + index"
                :class="{ 'tab-item-active': activeIndex === index }"
                @click="tabClick(index)"
                :style="{
                  color:
                    activeIndex === index
                      ? defaultConfig.activeTextColor
                      : defaultConfig.textColor,
                }"
                >{{ item.label || item }}</view
              >
            </block>
          </view>
          <!-- 滑块 -->
          <view
            class="underLine"
            :style="{
              transform: 'translateX(' + slider.left + 'px)',
              width: defaultConfig.underLineWidth + 'px',
              height: defaultConfig.underLineHeight + 'px',
              backgroundColor: defaultConfig.underLineColor,
            }"
          />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: "my-tab",
  props: {
     // 父组件传入的 tabs 数据
    tabData: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    defaultIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 内部维护的数据对象，为每个 item 单独额外维护一个 slider 的滑块对象
      tabList: [],
      // 当前激活项的 index
      activeIndex: -1,
      // 滑块对象
      slider: {
        // 距离左侧的距离
        left: 0,
      },
      // scrollView 的横向滚动条位置
      scrollLeft: 0,
      // 默认配置
      defaultConfig: {
        // 默认的字体颜色
        textColor: "#333333",
        // 高亮字体颜色
        activeTextColor: "#f94d2a",
        // 下划线宽度 px
        underLineWidth: 24,
        // 下划线高度 px
        underLineHeight: 2,
        // 下划线颜色
        underLineColor: "#f94d2a",
      },
    };
  },
  methods: {
    tabClick(index) {
      this.activeIndex = index;
      // 你可以获取到哪些值，当前activeIndex,点击哪个index，相减乘以div的宽度不就行了？
      this.$emit("tabClick", index);
    },
    /**
     * 更新tab item的宽度
     */
    updateTabWidth() {
      let data = this.tabList;
      const query = uni.createSelectorQuery().in(this);
      data.forEach((item, index) => {
        query
          .select("#_tab_" + index)
          .boundingClientRect((res) => {
            // 为数据对象中每一个 item 都维护一个 _slider（滑动条） 对象
            item._slider = {
              left:
                res.left + (res.width - this.defaultConfig.underLineWidth) / 2,
            };

            // 想想这个遍历作用是什么？为了获取到item的宽度，那什么情况下是需要滑动滑块的？比
            /**
             * 比如，第一个tab的index，这个时候我们如果点击第二个tab，上面已经做到了获取当前滑动位置，这个时候我们还要做的是
             * 获取，当前activeIndex，去把滑块给滑动过去
             */

            if (data.length - 1 === index) {
              // // 获取当前的 activeIndex
              // const index = this.activeIndex;

              // /**
              //  * 这个时候，知道为什么要在遍历里面定义一个_slider对象了吗，
              //  * 如果不维护单独的数据方法，直接在这里写就行了，但这个方法是为了获取到当前滑块的位置，是可以抽取出来共用的方法
              //  * 是为了封装组件，给内部维护数据，这样就不会出现数据的污染，都是独立的，写代码就要严格要求这样，封装的思想
              //  */
              // this.slider.left = res.left + (res.width - this.defaultConfig.underLineWidth) / 2;

              this.tabToIndex();
            }
          })
          .exec();
      });
    },
    /**
     * 根据当前的 activeIndex 下标，计算 【滑块】 滚动位置
     */
    tabToIndex() {
      if (this.tabList.length === 0) return;
      // 获取当前的 activeIndex
      const activeIndex = this.activeIndex;
      // 滑块的宽度
      const underLineWidth = this.defaultConfig.underLineWidth;
      // 配置 滚动条 的数据
      this.slider = {
        // TODO：left 如何定义呢？
        // 1. 维护一个单独的数据对象 `tabList`
        // 2. 在 `tabList`  的 `item` 中为一个 `_slider` 属性
        // 3. 该属性保存了 【当前 `item` 下 的滑块位置】
        //    3.1. 计算公式：`滑块左侧位置 = item.left + (item.width - slider.width) / 2`
        left: this.tabList[activeIndex]._slider.left,
      };
      // 为 scrollView 设置滚动位置
      this.scrollLeft = this.activeIndex * this.defaultConfig.underLineWidth;
    },
  },
  watch: {
    //  不能这样写的原因是，我们这个defaultIndex是在父组件中传递来的，当值第一次绑定不会执行，得使用immediate
    // defaultIndex(newIndex) {
    // 	this.activeIndex = newIndex;
    // }
    defaultIndex: {
      handler(index) {
        this.activeIndex = index;
        this.tabToIndex();
      },
      immediate: true,
    },
    // 侦听数据的变化
    tabData: {
      handler(val) {
        this.tabList = val;
        // 如果在vue里面应该是可以用nexttick 立马获取dom
        setTimeout(() => {
          this.updateTabWidth();
        }, 0);
      },
      // 该回调将会在侦听开始之后被立即调用
      immediate: true,
    },
    config: {
      handler(val) {
        this.defaultConfig = { ...defaultConfig, ...val };
      }
    }
  },
};
</script>

<style lang="scss"></style>
