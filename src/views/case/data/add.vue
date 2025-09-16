<template> 
  <case-data-detail :is-edit='false'></case-data-detail>
</template>
<script>
  import CaseDataDetail from './components/CaseDataDetail'
  export default {
    name: 'addCaseData',
    components: { CaseDataDetail }
  }
</script>
<style>
</style>