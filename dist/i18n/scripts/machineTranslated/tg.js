"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Қуттии",
            "sent": "Фиристода",
            "drafts": "Лоиҳаҳо",
            "trash": "Ахлот",
            "junk": "Ангалнома"
        },
        "delete": "Нобуд сохтани ҷузвдон",
        "empty": "Ин паёмдони холӣ холӣ аст"
    },
    "message": {
        "labels": {
            "from": "Аз:",
            "to": "Ба:",
            "date": "Фиристод:"
        }
    },
    "mailboxMessage": {
        "to": "Ба:"
    },
    "login": {
        "title": "даромад",
        "action": "даромад",
        "labels": {
            "username": "Номи корбар",
            "password": "Рамз"
        }
    },
    "accountButton": {
        "logout": "баромадан",
        "myAccount": "Ҳисоби ман",
        "filters": "Филтрҳо"
    },
    "compose": {
        "labels": {
            "to": "Ба:",
            "subject": "Мавзӯъ:",
            "cc": "Нусха:",
            "bcc": "Нусха аз:"
        },
        "tabs": {
            "newMessageTitle": "Паёми нав"
        }
    },
    "editor": {
        "cmd": {
            "undo": "Бекор кардан",
            "redo": "Такрор кунед",
            "fontName": "Навъи ҳарф",
            "fontSize": "Андозаи ҳарф",
            "bold": "Далер",
            "italic": "Курси",
            "underline": "Нишон диҳед",
            "justifyLeft": "Ҳамроҳ кунед",
            "justifyCenter": "Миёна ҳамоҳанг кунед",
            "justifyRight": "Ба рост рост кунед",
            "insertUnorderedList": "Рӯйхат",
            "insertOrderedList": "Рӯйхати рақамгузорӣ",
            "removeFormat": "Форматро нест кунед"
        },
        "color": {
            "tooltip": "Ранг",
            "foreColor": "Матн",
            "backColor": "Замина"
        },
        "upload": {
            "tooltip": "Замима кунед",
            "add": "Илова кунед",
            "remove": "Хориҷ кунед"
        },
        "send": "Ирсол"
    },
    "selection": {
        "title": [
            "{n} паёмҳо",
            "{n} паём",
            "{n} паёмҳо"
        ]
    },
    "actions": {
        "backToMailbox": "Бозгашт ба паёмдони почта",
        "reload": "Рафикон",
        "select": "Интихоб кунед",
        "markAsUnread": "Ҳамчун хондашуда қайд кунед",
        "markAsRead": "Ҳамчун хондашуда қайд кунед",
        "moveTo": "Ҷойивазкунӣ ба",
        "delete": "Нест кардан",
        "deletePermanently": "Ҳамешагӣ нест кунед",
        "discardDrafts": "Нақшаҳоро партоед",
        "markAsSpam": "Ҳамчун спам қайд кунед",
        "unMarkAsSpam": "Ин спам нест",
        "forward": "Форвард",
        "reply": "Ҷавоб додан",
        "attachments": "Замимаҳо"
    },
    "weekDays": {
        "0": "Якшанбе",
        "1": "Душанбе",
        "2": "Сешанбе",
        "3": "Чоршанбе",
        "4": "Панҷшанбе",
        "5": "Ҷумъа",
        "6": "Шанбе"
    },
    "months": {
        "0": "Январ",
        "1": "Феврал",
        "2": "Март",
        "3": "Апрел",
        "4": "Май",
        "5": "Июн",
        "6": "Июл",
        "7": "Август",
        "8": "сентябр",
        "9": "Октябр",
        "10": "Ноябр",
        "11": "Декабр"
    },
    "notifier": {
        "messageSent": "Хабар фиристода шуд",
        "mailboxDeleted": "Папка нест карда шуд"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "Феҳристи нав",
            "success": "Папка офаридааст"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "Эҷоди ҷузвдони нав",
            "label": "Номи папка",
            "accept": "Эҷод",
            "cancel": "Бекор кардан"
        },
        "deleteMailbox": {
            "title": "Нобуд кардани ҷузвдони \"{mailbox}\"",
            "desc": "Огоҳӣ. Ин амал тамоми паёмҳои ҷузвдонро ба пуррагӣ нест мекунад",
            "accept": "Нест кардан",
            "cancel": "Бекор кардан"
        }
    },
    "myAccount": {
        "title": "Ҳисоби ман",
        "limits": {
            "gbUsed": "{gb} ГБ",
            "gbTotal": "аз {gb} ГБ",
            "messagesUsed": [
                "{n} паёмҳо",
                "{n} паём",
                "{n} паёмҳо"
            ],
            "messagesTotal": [
                "аз паёмҳои {n}",
                "аз {n} паём",
                "аз паёмҳои {n}"
            ],
            "storage": {
                "title": "Захира"
            },
            "imapDownload": {
                "title": "IMAP зеркашӣ кунед",
                "comment": "ҳаррӯза"
            },
            "imapUpload": {
                "title": "Боркунии IMAP",
                "comment": "ҳаррӯза"
            },
            "pop3Download": {
                "title": "POP3 зеркашӣ",
                "comment": "ҳаррӯза"
            },
            "received": {
                "title": "Гирифтанд",
                "comment": "бо дақиқа"
            },
            "recipients": {
                "title": "Фиристода",
                "comment": "ҳаррӯза"
            },
            "forwards": {
                "title": "Аз нав ворид карда шуд",
                "comment": "ҳаррӯза"
            }
        }
    },
    "filters": {
        "title": "Филтрҳо",
        "commingSoon": "Ба зудӣ"
    }
};
exports.default = locale;
