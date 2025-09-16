<template> 
  <case-category-detail :is-edit='true'></case-category-detail>
</template>
<script>
  import CaseCategoryDetail from './components/CaseCategoryDetail'
  export default {
    name: 'updateCaseCategory',
    components: { CaseCategoryDetail }
  }
</script>
<style>
</style>