<template>
    <view class="hot-container">
        <image src="@/static" mode="" />
    </view>
</template>

<script>
import { getHotList } from '@/api/hot';
export default {
    data() {
        return {
            // tabs 数据源
            tabData: [],
        };
    },
    methods: {
        async getHotList() {
            // const { data : [list] } = await getHotList();
            // this.tabData = list;
			const { data } = await getHotList();
			this.tabData = data.list;
        },
    },
};
</script>

<style lang="scss"></style>
