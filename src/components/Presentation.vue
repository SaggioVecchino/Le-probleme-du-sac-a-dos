<template>
  <div id="presentation" class="text-center">
    <h1>Présentation</h1>
    <p>
      En algorithmique, le problème du sac à dos, noté également KP (en anglais,
      Knapsack problem) est un problème d'optimisation combinatoire. Il modélise
      une situation analogue au remplissage d'un sac à dos, ne pouvant supporter
      plus d'un certain poids, avec tout ou partie d'un ensemble donné d'objets
      ayant chacun un poids et une valeur. Les objets mis dans le sac à dos
      doivent maximiser la valeur totale, sans dépasser le poids maximum.
    </p>
    <br />
    <h1>Exemple</h1>
    <div class="p-1">
      <img src="../assets/exemple.png" alt="exemple" class="rounded center" />
      <p>
        Quelles boîtes choisir afin de maximiser la somme emportée tout en ne
        dépassant pas les 15 kg autorisés ?
      </p>
    </div>
    <router-link to="/app">
      <button class="btn btn-light padding-bottom">
        Place au jeu
      </button>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "Presentation"
};
</script>
<style scoped>
:any-link {
  color: black;
  text-decoration: none;
}

.padding-bottom {
  padding-bottom: 10px;
}
</style>
