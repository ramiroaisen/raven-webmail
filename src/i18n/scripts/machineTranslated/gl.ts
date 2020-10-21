import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Caixa de entrada",
      "sent": "Enviado",
      "drafts": "Borradores",
      "trash": "O lixo",
      "junk": "Correo non desexado"
    },
    "delete": "Eliminar o cartafol",
    "empty": "Esta caixa de correo está baleira"
  },
  "message": {
    "labels": {
      "from": "De:",
      "to": "Para:",
      "date": "Enviado:"
    }
  },
  "mailboxMessage": {
    "to": "Para:"
  },
  "login": {
    "title": "Rexístrate",
    "action": "Rexístrate",
    "labels": {
      "username": "Nome de usuario",
      "password": "Contrasinal"
    }
  },
  "accountButton": {
    "logout": "Pechar sesión",
    "myAccount": "A miña conta",
    "filters": "Filtros"
  },
  "compose": {
    "labels": {
      "to": "Para:",
      "subject": "Asunto:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Nova mensaxe"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Desfacer",
      "redo": "Recuperar",
      "fontName": "Tipo de letra",
      "fontSize": "Tamaño de letra",
      "bold": "Negriña",
      "italic": "Itálica",
      "underline": "Subliñado",
      "justifyLeft": "Aliña á esquerda",
      "justifyCenter": "Aliñar o medio",
      "justifyRight": "Aliñar dereito",
      "insertUnorderedList": "Lista",
      "insertOrderedList": "Lista numerada",
      "removeFormat": "Eliminar o formato"
    },
    "color": {
      "tooltip": "Cor",
      "foreColor": "Texto",
      "backColor": "Antecedentes"
    },
    "upload": {
      "tooltip": "Achegar",
      "add": "Engadir",
      "remove": "Quitar"
    },
    "send": "Enviar"
  },
  "selection": {
    "title": [
      "{n} mensaxes",
      "{n} mensaxe",
      "{n} mensaxes"
    ]
  },
  "actions": {
    "backToMailbox": "Volver á caixa de correo",
    "reload": "Actualizar",
    "select": "Seleccione",
    "markAsUnread": "Marca como non lido",
    "markAsRead": "Marcar como lido",
    "moveTo": "Mover a",
    "delete": "Eliminar",
    "deletePermanently": "Elimina permanentemente",
    "discardDrafts": "Descartar os borradores",
    "markAsSpam": "Marcar como spam",
    "unMarkAsSpam": "Isto non é spam",
    "forward": "Adiante",
    "reply": "Responder",
    "attachments": "Adxuntos"
  },
  "weekDays": {
    "0": "Domingo",
    "1": "Luns",
    "2": "Martes",
    "3": "Mércores",
    "4": "Xoves",
    "5": "Venres",
    "6": "Sábado"
  },
  "months": {
    "0": "xaneiro",
    "1": "Febreiro",
    "2": "Marzo",
    "3": "Abril",
    "4": "Maio",
    "5": "Xuño",
    "6": "Xullo",
    "7": "Agosto",
    "8": "Setembro",
    "9": "Outubro",
    "10": "Novembro",
    "11": "Decembro"
  },
  "notifier": {
    "messageSent": "Mensaxe enviada",
    "mailboxDeleted": "Eliminouse carpeta"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Nova carpeta",
      "success": "Carpeta creada"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Crear un novo cartafol",
      "label": "Nome de carpeta",
      "accept": "Crear",
      "cancel": "Cancelar"
    },
    "deleteMailbox": {
      "title": "Eliminar o cartafol \"{mailbox}\"",
      "desc": "Precaución. Esta acción eliminará permanentemente todas as mensaxes do cartafol",
      "accept": "Eliminar",
      "cancel": "Cancelar"
    }
  },
  "myAccount": {
    "title": "A miña conta",
    "commonActions": {
      "title": "Accións comúns",
      "updatePassword": "Actualizar contrasinal",
      "currentPassword": "Contrasinal actual",
      "newPassword": "Novo contrasinal",
      "confirmPassword": "Confirma o novo contrasinal"
    },
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "de {gb} GB",
      "messagesUsed": [
        "{n} mensaxes",
        "{n} mensaxe",
        "{n} mensaxes"
      ],
      "messagesTotal": [
        "de {n} mensaxes",
        "da mensaxe {n}",
        "de {n} mensaxes"
      ],
      "storage": {
        "title": "Almacenamento"
      },
      "imapDownload": {
        "title": "Descarga IMAP",
        "comment": "diariamente"
      },
      "imapUpload": {
        "title": "Cargar IMAP",
        "comment": "diariamente"
      },
      "pop3Download": {
        "title": "Descarga POP3",
        "comment": "diariamente"
      },
      "received": {
        "title": "Recibido",
        "comment": "por minuto"
      },
      "recipients": {
        "title": "Enviado",
        "comment": "diariamente"
      },
      "forwards": {
        "title": "Redireccionado",
        "comment": "diariamente"
      }
    }
  },
  "filters": {
    "title": "Filtros",
    "commingSoon": "Proximamente"
  }
};

export default locale;