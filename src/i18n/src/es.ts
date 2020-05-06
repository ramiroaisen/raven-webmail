export default {

    mailbox: {
        title: {
            inbox: "Recibidos",
            sent: "Enviados",
            drafts: "Borradores",
            trash: "Papelera",
            junk: "Spam",
        },

        empty: "No hay mensajes en esta carpeta",
    },

    mailboxMessage: {
        to: "Para:"
    },

    message: {
        labels: {
            from: "De:",
            to: "Para:",
            date: "Enviado:"
        }
    },

    login:  {
        title: "Ingresar",
        action: "Ingresar",
        labels: {
            username: "Usuario",
            password: "Contraseña"
        }
    },

    accountButton: {
        logout: "Cerrar sesión",
        myAccount: "Mi cuenta"
    },

    compose: {

        labels: {
            to: "Para:",
            subject: "Asunto:",
            cc: "Cc:",
            bcc: "Bcc:"
        },

        tabs: {
            newMessageTitle: "Mensaje nuevo"
        },
    },

    editor: {

        cmd: {
            undo: "Deshacer",
            redo: "Rehacer",
            fontName: "Tipo de fuente",
            fontSize: "Tamaño de fuente",
            bold: "Negrita",
            italic: "Itálica",
            underline: "Subrayado",
            justifyLeft: "Alinear a la izquierda",
            justifyCenter: "Alinear al centro",
            justifyRight: "Alinear a la derecha",
            insertUnorderedList: "Lista con viñetas",
            insertOrderedList: "Lista numerada",
            removeFormat: "Borrar formato",
        },

        color: {
            tooltip: "Color",
            foreColor: "Texto",
            backColor: "Fondo",
        },

        send: "Enviar",

        upload: {
            tooltip: "Adjuntar",
            add: "Agregar",
            remove: "Eliminar",
        },
    },

    selection: {

        title: [
            "{n} mensajes",
            "{n} mensaje",
            "{n} mensajes",
        ]
    },

    actions: {
        backToMailbox: "Volver a la bandeja",
        reload: "Actualizar",
        select: "Seleccionar",
        markAsUnread: "Marcar como no leído",
        markAsRead: "Marcar como leído",
        moveTo: "Mover a",
        delete: "Eliminar",
        deletePermanently: "Eliminar permanentemente",
        discardDrafts: "Descartar borradores",
        markAsSpam: "Marcar como spam",
        unMarkAsSpam: "No es spam",
        forward: "Reenviar",
        reply: "Responder",
        attachments: "Archivos adjuntos"
    },

    weekDays: {
        0: "Domingo",
        1: "Lunes",
        2: "Martes",
        3: "Miércoles",
        4: "Jueves",
        5: "Viernes",
        6: "Sábado",
    },

    months: {
        0: "Enero",
        1: "Febrero",
        2: "Marzo",
        3: "Abril",
        4: "Mayo",
        5: "Junio",
        6: "Julio",
        7: "Agosto",
        8: "Septiembre",
        9: "Octubre",
        10: "Noviembre",
        11: "Dociembre",
    },

    notifier: {
        messageSent: "Mensaje enviado"
    },

    drawerActions: {
        createMailbox: {
            label: "Nueva carpeta",
            success: "Carpeta creada"
        }
    },

    dialogs: {
        createMailbox: {
            title: "Crear nueva carpeta",
            label: "Nombre",
            accept: "Crear",
            cancel: "Cancelar",
        }
    },

    myAccount: {
        title: "Mi cuenta",

        limits: {

            gbUsed: "{gb} GB",
            gbTotal: "de {gb} GB",

            messagesUsed: [
                "{n} mensajes",
                "{n} mensaje",
                "{n} mensajes"
            ],

            messagesTotal: [
                "de {n} mensajes",
                "de {n} mensaje",
                "de {n} mensajes"
            ],

            storage: {
                title: "Almacenamiento"
            },
            imapDownload: {
                title: "Descarga IMAP",
                comment: "por día"
            },
            imapUpload: {
                title: "Subida IMAP",
                comment: "por día"
            },
            pop3Download: {
                title: "Descarga POP3",
                comment: "por día"
            },

            received: {
                title: "Recibidos",
                comment: "por minuto"
            },

            recipients: {
                title: "Enviados",
                comment: "por día"
            },

            forwards: {
                title: "Redirigidos",
                comment: "por día"
            }
        }
    }
}