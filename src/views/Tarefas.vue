<template>
  <Formulario @aoSalvarTarefa="salvarTarefa"/>
  <div class="lista">
    <Box v-if="semTarefas">
      Você não está muito produtivo hoje <span class="has-text-weight-bold">:(</span>
    </Box>
    <div class="field">
      <p class="control has-icons-left has-icons-right">
        <input class="input" type="text" placeholder="Pesquisar" v-model="filtro"/>
        <span class="icon is-small is-left">
          <i class="fas fa-search"></i>
        </span>
      </p>
    </div>
    <Tarefa v-for="(tarefa, index) in tarefas" :tarefa="tarefa" :key="index" @aoTarefaClicada="selecionarTarefa"/>
    <Modal :mostrar="tarefaSelecionada != null">
      <template v-slot:cabecalho>
        <p class="modal-card-title">Editando uma tarefa</p>
        <button class="delete" @click="fecharModal" aria-label="close"></button>
      </template>
      <template v-slot:corpo>
        <div class="field">
          <label for="descricaoDaTarefa" class="label"> Descrição </label>
          <input type="text" class="input" v-model="tarefaSelecionada.descricao" id="descricaoDaTarefa"/>
        </div>
      </template>
      <template v-slot:rodape>
        <div class="buttons">
          <button @click="alterarTarefa" class="button is-success">Salvar alterações</button>
          <button @click="fecharModal" class="button">Cancelar</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watchEffect} from "vue";
import Formulario from "../components/Formulario.vue";
import Tarefa from "../components/Tarefa.vue";
import Box from "../components/Box.vue";
import Modal from "@/components/Modal.vue";
import ITarefa from "../interfaces/ITarefa"
import {useStore} from "@/store";
import {OBTER_TAREFAS, CADASTRAR_TAREFA, OBTER_PROJETOS, ALTERAR_TAREFA} from "@/store/tipo-acoes";

export default defineComponent({
  name: "App",
  components: {
    Modal,
    Formulario,
    Tarefa,
    Box
  },
  data() {
    return {
      tarefaSelecionada: null as ITarefa | null
    }
  },
  methods: {
    salvarTarefa(tarefa: ITarefa): void {
      this.store.dispatch(CADASTRAR_TAREFA, tarefa)
    },
    selecionarTarefa(tarefa: ITarefa) {
      this.tarefaSelecionada = tarefa
    },
    fecharModal() {
      this.tarefaSelecionada = null
    },
    alterarTarefa() {
      this.store.dispatch(ALTERAR_TAREFA, this.tarefaSelecionada).then(() => this.fecharModal())
    }
  },
  computed: {
    semTarefas(): boolean {
      return this.tarefas.length == 0
    }
  },
  setup() {
    const store = useStore();
    store.dispatch(OBTER_TAREFAS)
    store.dispatch(OBTER_PROJETOS)

    const filtro = ref("")
    //const tarefas = computed(() =>
    //    store.state.tarefa.tarefas.filter(
    //        (t) => !filtro.value || t.descricao.includes(filtro.value)
    //    )
    //)

    /*
    Às vezes queremos observar um valor em específico, inclusive comparar o valor antigo com o novo.
    Quando isso é necessário, utilizamos o watch, e assim podemos observar melhor o que está acontecendo com o valor a que estamos reagindo:

    watch(filtro, (valorAtual, valorAntigo) => {
      if (valorAtual != valorAntigo) {
        store.dispatch(TipoAcoes.LISTAR_TAREFAS, valorAtual);
      }
    })
     */

    watchEffect(() => { // observando o campo filtro
      store.dispatch(OBTER_TAREFAS, filtro.value) // passando para action
    })

    return {
      tarefas: computed(() => store.state.tarefa.tarefas),
      store,
      filtro
    }
  }
});
</script>
