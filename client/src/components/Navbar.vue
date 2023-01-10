<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <a class="navbar-brand" href="#"><RouterLink to="/" class="nav-link" active-class="active">VueApp</RouterLink></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <RouterLink to="/" class="nav-link" active-class="active">Home</RouterLink>
          <RouterLink to="/category" class="nav-link" active-class="active">Category</RouterLink>
          <RouterLink to="/about" class="nav-link" active-class="active">About</RouterLink>
          <a class="nav-link disabled">Disabled</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  
}
</script>

<style lang="">
  
</style>