<template>
    <v-dialog persistent max-width="360px" v-model="showTelegramModal">
        <v-card>
            <v-toolbar density="compact">
                <template #title>
                    Notificações
                </template>
                <v-spacer />
                <v-icon class="mx-3" @click="showTelegramModal = false">mdi-close</v-icon>
            </v-toolbar>
            <v-card-text>
                <h3 class="mb-2 text-center">Ativar notificações pelo Telegram?</h3>
                <div class="mb-8">Para ativar as notificações, acesse o link abaixo, inicie o bot e copie o código
                    fornecido.
                    Cole o código no campo abaixo e clique em OK.</div>
                <h3 class="text-center mb-3"><a href="https://t.me/partithura_estagiario_bot"
                        target="_blank">partithura_estagiario_bot</a>
                </h3>
                <v-text-field v-model="identifyer" label="Código do Telegram" />
                <v-btn @click="registerNotificationCode()" block>Ok</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
const appStore = useAppStore()
const showTelegramModal = defineModel({ type: Boolean })
const identifyer = ref('')

function registerNotificationCode() {
    //registrar o usuário
    appStore.subscribeUser(identifyer.value)
        .then(r => {
            console.log("Response:", r)
        })
        .catch(err => {
            console.log("Erro:", err)
        })
        .finally(() => {
            showTelegramModal.value = false
        })
}
</script>