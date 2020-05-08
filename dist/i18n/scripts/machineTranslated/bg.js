"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Входящи",
            "sent": "Изпратено",
            "drafts": "дама",
            "trash": "боклук",
            "junk": "Спам"
        },
        "delete": "Изтриване на папка",
        "empty": "Тази пощенска кутия е празна"
    },
    "message": {
        "labels": {
            "from": "От:",
            "to": "Да се:",
            "date": "Изпратено на:"
        }
    },
    "mailboxMessage": {
        "to": "Да се:"
    },
    "login": {
        "title": "Впиши се",
        "action": "Впиши се",
        "labels": {
            "username": "Потребител",
            "password": "парола"
        }
    },
    "accountButton": {
        "logout": "Отписване",
        "myAccount": "Моята сметка"
    },
    "compose": {
        "labels": {
            "to": "Да се:",
            "subject": "Предмет:",
            "cc": "Копие:",
            "bcc": "Ск:"
        },
        "tabs": {
            "newMessageTitle": "Ново съобщение"
        }
    },
    "editor": {
        "cmd": {
            "undo": "Undo",
            "redo": "Redo",
            "fontName": "Тип шрифт",
            "fontSize": "Размер на шрифта",
            "bold": "смел",
            "italic": "италийски",
            "underline": "Подчертан",
            "justifyLeft": "Подравнете наляво",
            "justifyCenter": "Подравнете средата",
            "justifyRight": "Подравнете вдясно",
            "insertUnorderedList": "списък",
            "insertOrderedList": "Номериран списък",
            "removeFormat": "Премахване на формат"
        },
        "color": {
            "tooltip": "цвят",
            "foreColor": "Текст",
            "backColor": "Заден план"
        },
        "upload": {
            "tooltip": "Прикрепете",
            "add": "Добави",
            "remove": "Премахване"
        },
        "send": "Изпрати"
    },
    "selection": {
        "title": [
            "{n} съобщения",
            "{n} съобщение",
            "{n} съобщения"
        ]
    },
    "actions": {
        "backToMailbox": "Обратно към пощенската кутия",
        "reload": "Обновяване",
        "select": "Изберете",
        "markAsUnread": "Маркирайте като непрочетени",
        "markAsRead": "Маркирай като прочетено",
        "moveTo": "Преместване в",
        "delete": "Изтрий",
        "deletePermanently": "Изтрийте за постоянно",
        "discardDrafts": "Изхвърлете черновите",
        "markAsSpam": "отбележи като спам",
        "unMarkAsSpam": "Това не е спам",
        "forward": "напред",
        "reply": "Отговор",
        "attachments": "Прикачени"
    },
    "weekDays": {
        "0": "неделя",
        "1": "понеделник",
        "2": "вторник",
        "3": "сряда",
        "4": "четвъртък",
        "5": "петък",
        "6": "събота"
    },
    "months": {
        "0": "януари",
        "1": "февруари",
        "2": "Март",
        "3": "април",
        "4": "Може",
        "5": "юни",
        "6": "Юли",
        "7": "Август",
        "8": "Септември",
        "9": "октомври",
        "10": "ноември",
        "11": "декември"
    },
    "notifier": {
        "messageSent": "Съобщението е изпратено",
        "mailboxDeleted": "Папката е изтрита"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "Нова папка",
            "success": "Създадена е папка"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "Създайте нова папка",
            "label": "Име на папка",
            "accept": "създавам",
            "cancel": "Отказ"
        },
        "deleteMailbox": {
            "title": "Изтриване на папката \"{mailbox}\"",
            "desc": "Внимание. Това действие ще изтрие трайно всички съобщения в папката",
            "accept": "Изтрий",
            "cancel": "Отказ"
        }
    },
    "myAccount": {
        "title": "Моята сметка",
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "от {gb} GB",
            "messagesUsed": [
                "{n} съобщения",
                "{n} съобщение",
                "{n} съобщения"
            ],
            "messagesTotal": [
                "от {n} съобщения",
                "от {n} съобщение",
                "от {n} съобщения"
            ],
            "storage": {
                "title": "съхранение"
            },
            "imapDownload": {
                "title": "IMAP изтегляне",
                "comment": "ежедневно"
            },
            "imapUpload": {
                "title": "IMAP качване",
                "comment": "ежедневно"
            },
            "pop3Download": {
                "title": "POP3 Изтегляне",
                "comment": "ежедневно"
            },
            "received": {
                "title": "приет",
                "comment": "по минута"
            },
            "recipients": {
                "title": "Изпратено",
                "comment": "ежедневно"
            },
            "forwards": {
                "title": "Redirected",
                "comment": "ежедневно"
            }
        }
    }
};
exports.default = locale;
