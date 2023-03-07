<script>
  export let bindings;

  bindings.run("octocat/Spoon-Knife").then(e=>{
    console.log(e)
  })
</script>

<h1>
  {bindings.add(5, 5)}
</h1>
