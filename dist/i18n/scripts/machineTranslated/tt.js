"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Керү",
            "sent": "Sentибәрелгән",
            "drafts": "Каралама",
            "trash": "Чүп",
            "junk": "Спам"
        },
        "delete": "Папканы бетерегез",
        "empty": "Бу почта тартмасы буш"
    },
    "message": {
        "labels": {
            "from": "Кемнән:",
            "to": "Кемгә:",
            "date": "Sentибәрелгән:"
        }
    },
    "mailboxMessage": {
        "to": "Кемгә:"
    },
    "login": {
        "title": "Керегез",
        "action": "Керегез",
        "labels": {
            "username": "Кулланучы исеме",
            "password": "Серсүз"
        }
    },
    "accountButton": {
        "logout": "Чыгарга",
        "myAccount": "Минем хисап язма",
        "filters": "Фильтрлар"
    },
    "compose": {
        "labels": {
            "to": "Кемгә:",
            "subject": "Тема:",
            "cc": "Cc:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "Яңа хәбәр"
        }
    },
    "editor": {
        "cmd": {
            "undo": "Кире кайтару",
            "redo": "Кабатлау",
            "fontName": "Шрифт төре",
            "fontSize": "Хәреф зурлыгы",
            "bold": "Калын",
            "italic": "Италик",
            "underline": "Сызу",
            "justifyLeft": "Сулга тигезләнегез",
            "justifyCenter": "Урта тигезләгез",
            "justifyRight": "Уңга тигезләнегез",
            "insertUnorderedList": "Исемлек",
            "insertOrderedList": "Санлы исемлек",
            "removeFormat": "Форматны бетерегез"
        },
        "color": {
            "tooltip": "Төс",
            "foreColor": "Текст",
            "backColor": "Фон"
        },
        "upload": {
            "tooltip": "Беркетегез",
            "add": "Кушу",
            "remove": "Чыгар"
        },
        "send": "Sendибәр"
    },
    "selection": {
        "title": [
            "{n} хәбәрләр",
            "{n} хәбәр",
            "{n} хәбәрләр"
        ]
    },
    "actions": {
        "backToMailbox": "Почта тартмасына кире кайту",
        "reload": "Яңарту",
        "select": "Сайлагыз",
        "markAsUnread": "Укылмаган дип билгеләргә",
        "markAsRead": "Укылганча билгеләргә",
        "moveTo": "Күчерегез",
        "delete": "Бетерү",
        "deletePermanently": "Даими бетерегез",
        "discardDrafts": "Караламадан баш тарту",
        "markAsSpam": "Спам дип билгеләргә",
        "unMarkAsSpam": "Бу спам түгел",
        "forward": "FORWARD",
        "reply": "Lyавап бир",
        "attachments": "Кушымчалар"
    },
    "weekDays": {
        "0": "Якшәмбе",
        "1": "Дүшәмбе",
        "2": "Сишәмбе",
        "3": "Чәршәмбе",
        "4": "Пәнҗешәмбе",
        "5": "Fridayомга",
        "6": "Шимбә"
    },
    "months": {
        "0": "Гыйнвар",
        "1": "Февраль",
        "2": "Март",
        "3": "Апрель",
        "4": "Май",
        "5": "Июнь",
        "6": "Июль",
        "7": "Август",
        "8": "Сентябрь",
        "9": "Октябрь",
        "10": "Ноябрь",
        "11": "Декабрь"
    },
    "notifier": {
        "messageSent": "Хәбәр җибәрелде",
        "mailboxDeleted": "Папка бетерелде"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "Яңа папка",
            "success": "Папка ясалган"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "Яңа папка ясагыз",
            "label": "Папка исеме",
            "accept": "Ярат",
            "cancel": "Баш тарту"
        },
        "deleteMailbox": {
            "title": "\"{mailbox}\" папкасын бетерегез",
            "desc": "Сак булыгыз. Бу гамәл папкадагы барлык хәбәрләрне мәңгегә бетерәчәк",
            "accept": "Бетерү",
            "cancel": "Баш тарту"
        }
    },
    "myAccount": {
        "title": "Минем хисап язма",
        "commonActions": {
            "title": "Гомуми чаралар",
            "updatePassword": "Серсүзне яңарту",
            "currentPassword": "Хәзер кулланыла торган серсүз",
            "newPassword": "Яңа серсүз",
            "confirmPassword": "Яңа серсүзне раслагыз"
        },
        "limits": {
            "gbUsed": "{gb} ГБ",
            "gbTotal": "{gb} ГБ",
            "messagesUsed": [
                "{n} хәбәрләр",
                "{n} хәбәр",
                "{n} хәбәрләр"
            ],
            "messagesTotal": [
                "{n} хәбәрләр",
                "{n} хәбәр",
                "{n} хәбәрләр"
            ],
            "storage": {
                "title": "Саклау"
            },
            "imapDownload": {
                "title": "IMAP йөкләү",
                "comment": "көн саен"
            },
            "imapUpload": {
                "title": "IMAP йөкләү",
                "comment": "көн саен"
            },
            "pop3Download": {
                "title": "POP3 Йөкләү",
                "comment": "көн саен"
            },
            "received": {
                "title": "Кабул ителде",
                "comment": "минутка"
            },
            "recipients": {
                "title": "Sentибәрелгән",
                "comment": "көн саен"
            },
            "forwards": {
                "title": "Күрсәтелгән",
                "comment": "көн саен"
            }
        }
    },
    "filters": {
        "title": "Фильтрлар",
        "commingSoon": "Килә тиздән"
    }
};
exports.default = locale;
