"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Caixa de entrada",
            "sent": "Enviei",
            "drafts": "Rascunhos",
            "trash": "Lixo",
            "junk": "Spam"
        },
        "delete": "Excluir pasta",
        "empty": "Esta caixa de correio está vazia"
    },
    "message": {
        "labels": {
            "from": "De:",
            "to": "Para:",
            "date": "Enviei:"
        }
    },
    "mailboxMessage": {
        "to": "Para:"
    },
    "login": {
        "title": "assinar em",
        "action": "assinar em",
        "labels": {
            "username": "Nome do usuário",
            "password": "Senha"
        }
    },
    "accountButton": {
        "logout": "Sair",
        "myAccount": "Minha conta"
    },
    "compose": {
        "labels": {
            "to": "Para:",
            "subject": "Sujeito:",
            "cc": "Cc:",
            "bcc": "Cco:"
        },
        "tabs": {
            "newMessageTitle": "Nova mensagem"
        }
    },
    "editor": {
        "cmd": {
            "undo": "Desfazer",
            "redo": "Refazer",
            "fontName": "Tipo de fonte",
            "fontSize": "Tamanho da fonte",
            "bold": "Negrito",
            "italic": "itálico",
            "underline": "Sublinhado",
            "justifyLeft": "Alinhar à esquerda",
            "justifyCenter": "Alinhar ao meio",
            "justifyRight": "Alinhar à direita",
            "insertUnorderedList": "Lista",
            "insertOrderedList": "Lista numerada",
            "removeFormat": "Remover formato"
        },
        "color": {
            "tooltip": "Cor",
            "foreColor": "Texto",
            "backColor": "fundo"
        },
        "upload": {
            "tooltip": "Anexar",
            "add": "Adicionar",
            "remove": "Retirar"
        },
        "send": "Enviar"
    },
    "selection": {
        "title": [
            "{n} mensagens",
            "{n} mensagem",
            "{n} mensagens"
        ]
    },
    "actions": {
        "backToMailbox": "Voltar à caixa de correio",
        "reload": "Atualizar",
        "select": "Selecione",
        "markAsUnread": "Marcar como não lido",
        "markAsRead": "marcar como Lido",
        "moveTo": "Mover para",
        "delete": "Excluir",
        "deletePermanently": "Apagar permanentemente",
        "discardDrafts": "Descartar rascunhos",
        "markAsSpam": "marcar como spam",
        "unMarkAsSpam": "Isto não é spam",
        "forward": "frente",
        "reply": "Resposta",
        "attachments": "Anexos"
    },
    "weekDays": {
        "0": "domingo",
        "1": "Segunda-feira",
        "2": "terça",
        "3": "Quarta-feira",
        "4": "Quinta-feira",
        "5": "Sexta-feira",
        "6": "sábado"
    },
    "months": {
        "0": "janeiro",
        "1": "fevereiro",
        "2": "marcha",
        "3": "abril",
        "4": "Maio",
        "5": "Jun",
        "6": "Julho",
        "7": "agosto",
        "8": "setembro",
        "9": "Outubro",
        "10": "novembro",
        "11": "dezembro"
    },
    "notifier": {
        "messageSent": "Mensagem enviada",
        "mailboxDeleted": "Pasta excluída"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "Nova pasta",
            "success": "Pasta criada"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "Criar nova pasta",
            "label": "Nome da pasta",
            "accept": "Crio",
            "cancel": "Cancelar"
        },
        "deleteMailbox": {
            "title": "Excluir pasta \"{mailbox}\"",
            "desc": "Cuidado. Esta ação excluirá permanentemente todas as mensagens da pasta",
            "accept": "Excluir",
            "cancel": "Cancelar"
        }
    },
    "myAccount": {
        "title": "Minha conta",
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "de {gb} GB",
            "messagesUsed": [
                "{n} mensagens",
                "{n} mensagem",
                "{n} mensagens"
            ],
            "messagesTotal": [
                "de {n} mensagens",
                "de {n} mensagem",
                "de {n} mensagens"
            ],
            "storage": {
                "title": "Armazenamento"
            },
            "imapDownload": {
                "title": "Download IMAP",
                "comment": "diariamente"
            },
            "imapUpload": {
                "title": "Upload IMAP",
                "comment": "diariamente"
            },
            "pop3Download": {
                "title": "Baixar POP3",
                "comment": "diariamente"
            },
            "received": {
                "title": "Recebido",
                "comment": "por minuto"
            },
            "recipients": {
                "title": "Enviei",
                "comment": "diariamente"
            },
            "forwards": {
                "title": "Redirecionado",
                "comment": "diariamente"
            }
        }
    }
};
exports.default = locale;
