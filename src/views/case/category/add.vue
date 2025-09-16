<template> 
  <case-category-detail :is-edit='false'></case-category-detail>
</template>
<script>
  import CaseCategoryDetail from './components/CaseCategoryDetail'
  export default {
    name: 'addCaseCategory',
    components: { CaseCategoryDetail }
  }
</script>
<style>
</style>