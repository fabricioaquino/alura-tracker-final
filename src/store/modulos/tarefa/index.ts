import ITarefa from "@/interfaces/ITarefa";
import {Estado} from "@/store";
import {Module} from "vuex";
import {ADICIONA_TAREFA, ALTERA_TAREFA, DEFINIR_TAREFAS, NOTIFICAR} from "@/store/tipo-mutacoes";
import {INotificacao} from "@/interfaces/INotificacao";
import {ALTERAR_TAREFA, CADASTRAR_TAREFA, OBTER_TAREFAS} from "@/store/tipo-acoes";
import clientHttp from "@/http";

export interface EstadoTarefa {
    tarefas: ITarefa[]
}

export const tarefa: Module<EstadoTarefa, Estado> = {
    state: {
        tarefas: []
    },
    mutations: {
        [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
            state.tarefas = tarefas
        },
        [ADICIONA_TAREFA](state, tarefa: ITarefa) {
            state.tarefas.push(tarefa)
        },
        [ALTERA_TAREFA](state, tarefa: ITarefa) {
            const index = state.tarefas.findIndex(t => t.id == tarefa.id)
            state.tarefas[index] = tarefa
        }
    },
    actions: {
        /*
            Por que existem actions e mutations?
            Actions não alteram o estado diretamente, elas fazem commit das mutations. Além disso actions podem conter operações assíncronas, e as mutations não.
            Mutations alteram o estado e actions fazem processamento async e chamam as mutations quando necessário.
        */
        [OBTER_TAREFAS] ({ commit }, filtro: string) {
            let url = 'tarefas';

            if (filtro) {
                url += '?descricao='+filtro;
            }

            clientHttp.get(url).then(resposta => commit(DEFINIR_TAREFAS, resposta.data))
        },
        [CADASTRAR_TAREFA] ({commit}, tarefa: ITarefa) {
            return clientHttp.post('tarefas', tarefa)
                .then(resposta => commit(ADICIONA_TAREFA, resposta.data))
        },
        [ALTERAR_TAREFA] ({commit}, tarefa: ITarefa) {
            return clientHttp.put(`/tarefas/${tarefa.id}`, tarefa)
                .then(() => commit(ALTERA_TAREFA, tarefa))
        },
    }
}