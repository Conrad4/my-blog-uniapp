<template>
  <view class="hot-container">
    <!-- logo -->
    <image class="logo" mode="aspectFit" src="@/static/images/logo.png" />
    <view class="search-box" @click="onToSearch">
      <!-- 搜索模块 -->
      <my-search placeholderText="uni-app 自定义组件" />
    </view>
    <!-- tabs -->
    <view class="tab-sticky">
      <my-tabs
        :tabData="tabData"
        :defaultIndex="currentIndex"
        :config="{ textColor: '#333333' }"
        @tabClick="tabClick"
      ></my-tabs>
    </view>

    <view>
      <uni-load-more :status="loading" v-if="isLoading" />
      <block v-else>
        <hot-list-item
          v-for="(item, index) in listData[currentIndex]"
          :data="item"
          :key="index"
          :ranking="index + 1"
        >
        </hot-list-item>
      </block>
    </view>
  </view>
</template>

<script>
import { getHotList, getHotListFromTabType } from "@/api/hot";
import hotListItem from "../../components/hot-list-item/hot-list-item.vue";

export default {
  components: { hotListItem },
  data() {
    return {
      // tabs 数据源
      tabData: [],
      currentIndex: 0,
      // 以 index 为 key，对应的 list 为 val
      listData: {},
      // 当前 swiper 的高度
      currentSwiperHeight: 0,
    };
  },
  methods: {
    async getHotList() {
      // const { data : [list] } = await getHotList();
      // this.tabData = list;
      const { data } = await getHotList();
      this.tabData = data.list;
    },
    async getHotListFromTabType() {
      // id 从哪里获取啊，从第一个接口里面获取的tabData 数组里面的id，
      /**
       * 想一下这个逻辑，点击哪个tab，获取到当前的id，点击的索引值怎么获得？
       */
      if (!this.tabData[this.currentIndex]) {
        this.isLoading = true;
        const id = this.tabData[this.currentIndex].id;
        const { data: res } = await getHotListFromTabType(id);
        // 把请求过的数据保存到本地
        this.listData[this.currentIndex] = res.list;
      }

      this.isLoading = false;

      setTimeout(() => {
        this.currentSwiperHeight = await this.getCurrentSwiperHeight();
        

      },0)

      set;
    },
    /**
     * 计算当前 swiper 的高度
     */
    getCurrentSwiperHeight() {
      return new Promise((resolve, reject) => {
        let sum = 0;
        const query = uni.createSelectorQuery().in(this);
        query
          .selectAll(`.hot-list-item-${this.currentIndex}`)
          .boundingClientRect((res) => {
            res.forEach((item) => {
              sum += item.height;
            });
            resolve(sum);
          })
          .exec();
      });
    },
  },
};
</script>

<style lang="scss"></style>
