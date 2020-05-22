<template>
  <div class="page">
    123
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$fetch({
        url: "https://www.jianshu.com/p/d45a31c50711",
        method: "post",
        data: {
          name: "lwj",
          age: 26
        }
      }).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  components: {},
  watch: {}
};
</script>

<style scoped lang="less"></style>
