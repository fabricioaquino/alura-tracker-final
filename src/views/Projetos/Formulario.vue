<template>
  <section>
    <form @submit.prevent="salvar">
      <div class="field">
        <label for="nomeDoProjeto" class="label"> Nome do Projeto </label>
        <input type="text" class="input" v-model="nomeDoProjeto" id="nomeDoProjet" />
      </div>
      <div class="field">
        <button class="button" type="submit">Salvar</button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, ref } from "vue";

import { TipoNotificacao } from "@/interfaces/INotificacao";

import useNotificador from '@/hooks/notificador'
import { CADASTRAR_PROJETO, ALTERAR_PROJETO } from "@/store/tipo-acoes";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "Formulario",
  props: {
    id: {
      type: String
    }
  },
  //mounted() {
  //  if (this.id) {
  //    const projeto = this.store.state.projeto.projetos.find(proj => proj.id == this.id)
  //    this.nomeDoProjeto = projeto?.nome || ''
  //  }
  //},
  //data() {
  //  return {
  //    nomeDoProjeto: ""
  //  };
  //},
  methods: { // dentro do method tenho acesso ao this. , no setup não
    //salvar() {
    //  if (this.id) {
    //    this.store.dispatch(ALTERAR_PROJETO, { // editar
    //      id: this.id,
    //      nome: this.nomeDoProjeto
    //    }).then(() => this.lidarComSucesso());
    //  } else { // novo
    //    this.store.dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto)
    //      .then(() => {
    //        this.lidarComSucesso()
    //      })
    //  }
    //},
    //lidarComSucesso() {
    //  this.nomeDoProjeto = "";
    //  this.notificar(TipoNotificacao.SUCESSO, 'Excelente!', 'O projeto foi cadastrado com sucesso!')
    //  this.$router.push('/projetos') // redireciona
    //}
  },
  setup(props) {
    /*
      Conforme os componentes e a aplicação vão crescendo, organizar nosso código apenas pelas options (data, computed, methods, watch) se torna uma tarefa complexa.
      A motivação da composition API é justamente essa! .
     */

    const router = useRouter();

    const store = useStore()
    const { notificar } = useNotificador()

    // Variavel que precisa ser obs , usando metodo ref
    const nomeDoProjeto = ref("")

    if (props.id) {
      const projeto = store.state.projeto.projetos.find(proj => proj.id == props.id)
      nomeDoProjeto.value = projeto?.nome || ''
    }

    const salvar = () => {
      if (props.id) {
        store.dispatch(ALTERAR_PROJETO, { // editar
          id: props.id,
          nome: nomeDoProjeto.value
        }).then(() => lidarComSucesso());
      } else { // novo
        store.dispatch(CADASTRAR_PROJETO, nomeDoProjeto.value)
            .then(() => {
              lidarComSucesso()
            })
      }
    };

    const lidarComSucesso = () => {
      nomeDoProjeto.value = "";
      notificar(TipoNotificacao.SUCESSO, 'Excelente!', 'O projeto foi cadastrado com sucesso!')
      router.push('/projetos') // redireciona
    }

    return {
      //store,
      //notificar,
      nomeDoProjeto,
      salvar
    }
  }
});
</script>
