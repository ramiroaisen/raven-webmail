import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Bandeja de entrada",
      "sent": "Expedido",
      "drafts": "Borradores",
      "trash": "Basura",
      "junk": "Correo no deseado"
    },
    "delete": "Eliminar carpeta",
    "empty": "Este buzón está vacío"
  },
  "message": {
    "labels": {
      "from": "Desde:",
      "to": "A:",
      "date": "Expedido:"
    }
  },
  "mailboxMessage": {
    "to": "A:"
  },
  "login": {
    "title": "Registrarse",
    "action": "Registrarse",
    "labels": {
      "username": "Nombre de usuario",
      "password": "Contraseña"
    }
  },
  "accountButton": {
    "logout": "desconectar",
    "myAccount": "Mi cuenta",
    "filters": "Filtros"
  },
  "compose": {
    "labels": {
      "to": "A:",
      "subject": "Tema:",
      "cc": "CC:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Nuevo mensaje"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Deshacer",
      "redo": "Rehacer",
      "fontName": "Tipo de fuente",
      "fontSize": "Tamaño de fuente",
      "bold": "Negrita",
      "italic": "Itálico",
      "underline": "Subrayar",
      "justifyLeft": "Alinear a la izquierda",
      "justifyCenter": "Alinear medio",
      "justifyRight": "Alinear a la derecha",
      "insertUnorderedList": "Lista",
      "insertOrderedList": "Lista numerada",
      "removeFormat": "Eliminar formato"
    },
    "color": {
      "tooltip": "Color",
      "foreColor": "Texto",
      "backColor": "Antecedentes"
    },
    "upload": {
      "tooltip": "Adjuntar",
      "add": "Añadir",
      "remove": "Eliminar"
    },
    "send": "Enviar"
  },
  "selection": {
    "title": [
      "{n} mensajes",
      "{n} mensaje",
      "{n} mensajes"
    ]
  },
  "actions": {
    "backToMailbox": "Volver al buzón",
    "reload": "Actualizar",
    "select": "Seleccione",
    "markAsUnread": "Marcar como no leído",
    "markAsRead": "Marcar como leído",
    "moveTo": "Mover a",
    "delete": "Eliminar",
    "deletePermanently": "Borrar permanentemente",
    "discardDrafts": "Descartar borradores",
    "markAsSpam": "Marcar como correo no deseado",
    "unMarkAsSpam": "Esto no es spam",
    "forward": "Adelante",
    "reply": "Respuesta",
    "attachments": "Archivos adjuntos"
  },
  "weekDays": {
    "0": "domingo",
    "1": "lunes",
    "2": "martes",
    "3": "miércoles",
    "4": "jueves",
    "5": "viernes",
    "6": "sábado"
  },
  "months": {
    "0": "enero",
    "1": "febrero",
    "2": "marzo",
    "3": "abril",
    "4": "Mayo",
    "5": "jun",
    "6": "julio",
    "7": "agosto",
    "8": "septiembre",
    "9": "octubre",
    "10": "noviembre",
    "11": "diciembre"
  },
  "notifier": {
    "messageSent": "Mensaje enviado",
    "mailboxDeleted": "Carpeta eliminada"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Nueva carpeta",
      "success": "Carpeta creada"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Crear nueva carpeta",
      "label": "Nombre de la carpeta",
      "accept": "Crear",
      "cancel": "Cancelar"
    },
    "deleteMailbox": {
      "title": "Eliminar carpeta \"{mailbox}\"",
      "desc": "Precaución. Esta acción eliminará permanentemente todos los mensajes en la carpeta",
      "accept": "Eliminar",
      "cancel": "Cancelar"
    }
  },
  "myAccount": {
    "title": "Mi cuenta",
    "commonActions": {
      "title": "Acciones comunes",
      "updatePassword": "Actualiza contraseña",
      "currentPassword": "Contraseña actual",
      "newPassword": "Nueva contraseña",
      "confirmPassword": "Confirmar nueva contraseña"
    },
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "de {gb} GB",
      "messagesUsed": [
        "{n} mensajes",
        "{n} mensaje",
        "{n} mensajes"
      ],
      "messagesTotal": [
        "de {n} mensajes",
        "de {n} mensaje",
        "de {n} mensajes"
      ],
      "storage": {
        "title": "Almacenamiento"
      },
      "imapDownload": {
        "title": "Descarga IMAP",
        "comment": "diario"
      },
      "imapUpload": {
        "title": "Carga de IMAP",
        "comment": "diario"
      },
      "pop3Download": {
        "title": "Descarga POP3",
        "comment": "diario"
      },
      "received": {
        "title": "Recibido",
        "comment": "por minuto"
      },
      "recipients": {
        "title": "Expedido",
        "comment": "diario"
      },
      "forwards": {
        "title": "Redirigido",
        "comment": "diario"
      }
    }
  },
  "filters": {
    "title": "Filtros",
    "commingSoon": "Próximamente"
  }
};

export default locale;