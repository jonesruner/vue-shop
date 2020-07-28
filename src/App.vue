<template>
  <div id="app">
       <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="less" >
 html,body,router-view,#app
{
   width: 100%;
   height: 100%;
   margin: 0;
   padding: 0;
}
</style>
