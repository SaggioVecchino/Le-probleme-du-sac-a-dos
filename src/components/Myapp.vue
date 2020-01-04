<template>
  <div>
    <div v-if="!game" id="presentation" class="text-center">
      <h1>Présentation</h1>
      <p>
        En algorithmique, le problème du sac à dos, noté également KP (en anglais, Knapsack problem) est un problème
        d'optimisation combinatoire. Il modélise une situation analogue au remplissage d'un sac à dos, ne pouvant
        supporter plus d'un certain poids, avec tout ou partie d'un ensemble donné d'objets ayant chacun un poids et une
        valeur. Les objets mis dans le sac à dos doivent maximiser la valeur totale, sans dépasser le poids maximum.
      </p>
      <br />
      <h1>Exemple</h1>
      <div class="p-1">
        <img src="../assets/exemple.png" alt="exemple" class="rounded center" />
        <p>
          Quelles boîtes choisir afin de maximiser la somme emportée tout en ne dépassant pas
          les 15
          kg autorisés ?
        </p>
      </div>
      <button class="btn btn-light" @click="game=true;">Place au jeu</button>
    </div>
    <!-- else (game) -->
    <div v-else id="game" class="d-flex flex-wrap justify-content-center">
      <div class="p-3 col-lg-4 d-flex justify-content-center">
        <div class="text-center">
          <label for="contrainte">
            <b>Capacité maximale du cartable:</b>
          </label>
          <input type="text" name="contrainte" v-model="contrainteNonFiltree" />
          <br />
          <button @click="ajouterObjet" class="btn btn-light">Ajouter un objet</button>
          <br />
          <div v-for="(objet, index) in this.objetsNonFiltres" :key="index">
            <b>Objet {{index + 1}}</b>
            <br />
            <label for="poids">
              <b>Poids:</b>
            </label>
            <input type="text" name="poids" v-model="objet.poids" />
            <label for="valeur">
              <b>Valeur:</b>
            </label>
            <input type="text" name="valeur" v-model="objet.valeur" />
            <button
              type="button"
              class="btn btn-link btn-sm"
              @click="supprimerObjet(index)"
              v-bind:title="'Supprimer l\'objet n°' + (index+1)"
            >X</button>
          </div>
        </div>
      </div>
      <div class="p-3 col-lg-3">
        <div class="text-center">
          <i
            class="fas fa-shopping-bag"
            :style="{fontSize: sizePoids
          [objetsNonFiltres.length] + 'px'}"
          ></i>
          <br />
          <b>Capacité maximale du cartable:</b>
          {{contrainteFiltree}}
        </div>
        <div v-if="objetsFiltres.length > 0" style="box-sizing: border-box">
          <div
            v-for="(objet, index) in objetsFiltres"
            :key="index"
            class="p-1 objet mt-1"
            style="position: relative;"
            :class="{ selected: objetsNonFiltres[index].selected }"
            v-show="neMasquePas(index)"
          >
            <div class="supprimerObjet">
              <a @click="supprimerObjet(index)" :title="'Supprimer l\'objet n°' + (index+1)">x</a>
            </div>
            <b class="ml-2">Objet {{index+1}}</b>
            <div class="d-flex text-center">
              <div class="col-5 align-self-end">
                <i class="fas fa-book" :style="{fontSize: sizePoids[index] + 'px'}"></i>
                <br />
                <b>Poids:</b>
                {{objet.poids}}
              </div>
              <div class="col-5 align-self-end">
                <i class="fas fa-dollar-sign" :style="{fontSize: sizeValeurs[index] + 'px'}"></i>
                <br />
                <b>Valeur:</b>
                {{objet.valeur}}
              </div>
            </div>
          </div>
        </div>
        <div v-else>Vous avez un sac mais rien à mettre dedans :o !</div>
      </div>
      <div class="p-1 col-lg-5 pl-5">
        <div v-if="objetsFiltres.length > 0">
          <h1>
            Solution
            <span v-if="solution.nbSolutionsPossibles > 1">s</span>:
          </h1>
          La solution optimale (valeur maximale): {{solution.valeurMaximale}}
          <br />
          <div v-if="solution.nbSolutionsPossibles > 1">
            Nombre de solutions possibles: {{solution.nbSolutionsPossibles}}
            <br />Les solutions possibles (toutes les combinaisons possibles des objets):
            <ul>
              <li
                v-for="(slt, index) in solution.solutions"
                :key="index"
                @mouseover="afficherSolution(index)"
                @mouseout="masquerSolution(index)"
              >
                solution n°{{index+1}}:
                <ul>
                  <li>Les objets: {{slt.combinaison}}</li>
                  <li>Poids total: {{slt.poidsTotal}}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div
            v-if="solution.nbSolutionsPossibles == 1"
            @mouseover="afficherSolution(0)"
            @mouseout="masquerSolution(0)"
          >
            La seule solution possible:
            <ul>
              <li>Les objets: {{solution.solutions[0].combinaison}}</li>
              <li>Poids total: {{solution.solutions[0].poidsTotal}}</li>
            </ul>
          </div>
        </div>
        <div v-else>
          <blockquote>&ldquo;Le seul mauvais choix est l'absence de choix.&bdquo;</blockquote>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Myapp",
  data() {
    return {
      game: false,
      contrainteNonFiltree: 10,
      objetsNonFiltres: [],
      sizeRefPx: 60,
      mouseover: false
    };
  },
  computed: {
    contrainteFiltree() {
      return Number(this.contrainteNonFiltree) >= 1
        ? parseInt(Number(this.contrainteNonFiltree))
        : 1;
    },
    objetsFiltres() {
      return this.objetsNonFiltres.map(x => {
        return {
          poids: Number(x.poids) >= 1 ? parseInt(Number(x.poids)) : 1,
          valeur: Number(x.valeur) >= 0 ? parseInt(Number(x.valeur)) : 0
        };
      });
    },
    solution() {
      var solution = this.problemeSacADos(
        this.objetsFiltres,
        this.contrainteFiltree
      );
      return solution;
    },
    sizePoids() {
      var mx = Math.max(
        ...this.objetsFiltres.map(x => x.poids),
        this.contrainteNonFiltree
      );
      return [
        ...this.objetsFiltres.map(x => (x.poids / mx) * this.sizeRefPx),
        (this.contrainteFiltree / mx) * this.sizeRefPx * 1.4
      ];
    },
    sizeValeurs() {
      var mx = Math.max(...this.objetsFiltres.map(x => x.valeur));
      if (mx == 0) return [...this.objetsFiltres.map(x => x.valeur)];
      return [...this.objetsFiltres.map(x => (x.valeur / mx) * this.sizeRefPx)];
    }
  },
  mounted() {},
  methods: {
    ajouterObjet() {
      this.objetsNonFiltres.push({ poids: 1, valeur: 0, selected: false });
    },

    supprimerObjet(index) {
      this.objetsNonFiltres.splice(index, 1);
      this.mouseover = false;
      for (var k = 0; k < this.solution.solutions.length; k++)
        for (var i = 0; i < this.solution.solutions[k].combinaison.length; i++)
          this.objetsNonFiltres[
            this.solution.solutions[k].combinaison[i] - 1
          ].selected = false;
    },

    afficherSolution(index) {
      this.mouseover = true;
      for (
        var i = 0;
        i < this.solution.solutions[index].combinaison.length;
        i++
      )
        this.objetsNonFiltres[
          this.solution.solutions[index].combinaison[i] - 1
        ].selected = true;
    },

    masquerSolution(index) {
      this.mouseover = false;
      try {
        for (
          var i = 0;
          i < this.solution.solutions[index].combinaison.length;
          i++
        )
          this.objetsNonFiltres[
            this.solution.solutions[index].combinaison[i] - 1
          ].selected = false;
      } finally {
        return;
      }
    },

    neMasquePas(index) {
      return !this.mouseover || this.objetsNonFiltres[index].selected;
    },

    initialiserSelected() {
      for (var i = 0; i < this.objetsNonFiltres.length; i++)
        this.objetsNonFiltres[i].selected = false;
    },
    problemeSacADos(objets, contrainte) {
      //ça a rapport avec le style:
      this.initialiserSelected();
      //On essaie de minimiser la contrainte pour avoir une matrice de solution réduite
      //(en gardant biensur le problème équivalent)
      contrainte = Math.min(
        contrainte,
        (function(objets) {
          var sommeTotaleDesPoidsDesObjets = 0;
          objets.forEach(function(e) {
            sommeTotaleDesPoidsDesObjets += e.poids;
          });
          return sommeTotaleDesPoidsDesObjets;
        })(objets)
      );
      var matriceSolution = [];
      //On peut s'en passer des 0 sur j=0 et i=0 mais cela mènera vers des vérifications (des if)
      //On opte pour la solution où il y'a les 0 puisque il n'y a pas vraiment une perte significative
      //coté mémoire (W+n-1 entiers)
      matriceSolution[0] = [];
      for (var k = 0; k <= contrainte; k++) matriceSolution[0][k] = 0;
      for (var k = 1; k <= objets.length; k++) {
        matriceSolution[k] = [];
        matriceSolution[k][0] = 0;
      }
      for (var i = 1; i <= objets.length; i++) {
        for (var j = 1; j <= contrainte; j++) {
          matriceSolution[i][j] =
            j < objets[i - 1].poids
              ? matriceSolution[i - 1][j]
              : Math.max(
                  matriceSolution[i - 1][j],
                  matriceSolution[i - 1][j - objets[i - 1].poids] +
                    objets[i - 1].valeur
                );
        }
      }

      var solutions = this.trouverCombinaisons(
        i - 1,
        j - 1,
        objets,
        matriceSolution
      );

      return {
        matriceDynamicProgramming: matriceSolution,
        nbSolutionsPossibles: solutions.length,
        solutions: solutions.map(e => {
          var somme = 0;
          e.forEach(function(objet) {
            somme += objets[objet - 1].poids;
          });
          return {
            combinaison: e.reverse(),
            nombreObjets: e.length,
            poidsTotal: somme
          };
        }),
        valeurMaximale: matriceSolution[objets.length][contrainte]
      };
    },
    trouverCombinaisons(i, j, objets, matriceSolution) {
      var combinaisons = [];
      var ind = 0;
      combinaisons[ind] = [];
      while (i > 0 && j > 0) {
        //comparaison pour savoir est ce qu'on a pris cette valeur du troisième cas de l'equation de l'algorithme
        //choisi pour ce problème, on peut avoir 3 cas >, =, <
        // pour le cas = on a deux possibilités: ne pas prendre le i ou le prendre ce qui va donner deux sous solutions
        let comparaison =
          matriceSolution[i - 1][j - objets[i - 1].poids] +
          objets[i - 1].valeur -
          matriceSolution[i - 1][j];
        if (comparaison >= 0) {
          if (comparaison == 0) {
            let combsSansPrendreI = this.trouverCombinaisons(
              i - 1,
              j,
              objets,
              matriceSolution
            );
            let combSave = [...combinaisons[ind]]; //pour rajouter les solutions aux éléments obtenus jusqu'à maintenant
            for (let loop = 0; loop < combsSansPrendreI.length; loop++) {
              combinaisons[ind].push(...combsSansPrendreI[loop]);
              ind++;
              combinaisons[ind] = [...combSave];
            }
          }
          //comparaison > 0 dans ce cas on doit prendre i ou bien comparaison = 0 et là
          //on a déjà traité le cas de la non prise du i et on traite maintenant le cas où on prend de i
          combinaisons[ind].push(i);
          j -= objets[i - 1].poids;
          i--;
        } else {
          //comparaison < 0
          i--;
        }
      }
      return combinaisons;
    }
  }
};
</script>

<style scoped>
.btn-link,
.btn-link:hover,
.btn-link:active,
.btn-link:focus {
  color: #d34444;
  text-decoration: none;
}

ul,
li {
  box-sizing: border-box;
}

.objet {
  background-color: #d1e8e2;
  border-radius: 3px;
  color: #2c3531;
}

.supprimerObjet {
  width: 17px;
  height: 17px;
  text-align: center;
  color: #d1e8e2;
  background: #d34444;
  border-radius: 50%;
  position: absolute;
  top: 7px;
  left: -6px;
  padding-bottom: 5px;
}

.supprimerObjet a {
  display: block;
  position: relative;
  bottom: 5px;
  right: 1px;
  width: 17px;
  height: 17px;
}

.supprimerObjet a:hover {
  cursor: pointer;
}

.selected {
  color: #d34444;
  -webkit-box-shadow: inset 0px 0px 0px 1px #d34444;
  -moz-box-shadow: inset 0px 0px 0px 1px #d34444;
  box-shadow: inset 0px 0px 0px 1px #d34444;
}

*::selection {
  background: #7acfdf; /* WebKit/Blink Browsers */
}
*::-moz-selection {
  background: #7acfdf; /* Gecko Browsers */
}
</style>
