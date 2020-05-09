"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Ирсэн мэйл",
            "sent": "Илгээсэн",
            "drafts": "Ноорог",
            "trash": "Хог",
            "junk": "Спам"
        },
        "delete": "Фолдерыг устгах",
        "empty": "Энэ шуудангийн хайрцаг хоосон байна"
    },
    "message": {
        "labels": {
            "from": "Дараахаас",
            "to": "Хэнд",
            "date": "Илгээсэн:"
        }
    },
    "mailboxMessage": {
        "to": "Хэнд"
    },
    "login": {
        "title": "Нэвтрэн орно уу",
        "action": "Нэвтрэн орно уу",
        "labels": {
            "username": "Хэрэглэгчийн нэр",
            "password": "Нууц үг"
        }
    },
    "accountButton": {
        "logout": "Гарах",
        "myAccount": "Миний данс",
        "filters": "Шүүлтүүрүүд"
    },
    "compose": {
        "labels": {
            "to": "Хэнд",
            "subject": "Гарчиг:",
            "cc": "Cc:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "Шинэ мессеж"
        }
    },
    "editor": {
        "cmd": {
            "undo": "Буцаах",
            "redo": "Дахин хийх",
            "fontName": "Үсгийн төрөл",
            "fontSize": "Үсгийн хэмжээ",
            "bold": "Зоригтой",
            "italic": "Налуу",
            "underline": "Доогуур нь зур",
            "justifyLeft": "Зүүн тийш нь тэгшлэ",
            "justifyCenter": "Дунд талыг нь тэгшлэ",
            "justifyRight": "Баруун тийш нь чиглүүл",
            "insertUnorderedList": "Жагсаалт",
            "insertOrderedList": "Дугаарласан жагсаалт",
            "removeFormat": "Форматыг устгана уу"
        },
        "color": {
            "tooltip": "Өнгө",
            "foreColor": "Текстээр бичнэ үү",
            "backColor": "Ерөнхий мэдээлэл"
        },
        "upload": {
            "tooltip": "Хавсаргана уу",
            "add": "Нэмэх",
            "remove": "Хасах"
        },
        "send": "Илгээх"
    },
    "selection": {
        "title": [
            "{n} мессеж",
            "{n} мессеж",
            "{n} мессеж"
        ]
    },
    "actions": {
        "backToMailbox": "Мэйл хайрцаг руу буцах",
        "reload": "Сэргээнэ үү",
        "select": "Сонгоно уу",
        "markAsUnread": "Уншаагүй гэж тэмдэглэх",
        "markAsRead": "Уншсан гэж тэмдэглэх",
        "moveTo": "Нүүх",
        "delete": "Устгах",
        "deletePermanently": "Бүрмөсөн устгах",
        "discardDrafts": "Ноорог хаях",
        "markAsSpam": "Спам гэж тэмдэглэ",
        "unMarkAsSpam": "Энэ бол спам биш",
        "forward": "Дамжуулах",
        "reply": "Хариу өгөх",
        "attachments": "Хавсралтууд"
    },
    "weekDays": {
        "0": "Ням гараг",
        "1": "Даваа гариг",
        "2": "Мягмар гараг",
        "3": "Лхагва гараг",
        "4": "Пүрэв гараг",
        "5": "Баасан гараг",
        "6": "Бямба гараг"
    },
    "months": {
        "0": "1-р сар",
        "1": "2-р сар",
        "2": "3-р сар",
        "3": "4-р сар",
        "4": "5-р сар",
        "5": "6-р сар",
        "6": "7-р сар",
        "7": "Наймдугаар сар",
        "8": "9-р сар",
        "9": "10-р сар",
        "10": "11-р сар",
        "11": "Арванхоёрдугаар сар"
    },
    "notifier": {
        "messageSent": "Мессеж илгээгдсэн байна",
        "mailboxDeleted": "Фолдерийг устгасан байна"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "Шинэ хавтас",
            "success": "Хавтас үүсгэсэн байна"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "Шинэ хавтас үүсгэх",
            "label": "Фолдерын нэр",
            "accept": "Үүсгэх",
            "cancel": "Цуцлах"
        },
        "deleteMailbox": {
            "title": "\"{mailbox}\" фолдерыг устгах",
            "desc": "Анхааруулга. Энэ үйлдэл нь хавтас доторх бүх мессежүүдийг бүрмөсөн устгах болно",
            "accept": "Устгах",
            "cancel": "Цуцлах"
        }
    },
    "myAccount": {
        "title": "Миний данс",
        "limits": {
            "gbUsed": "{gb} ГБ байна",
            "gbTotal": "нь {gb} ГБ",
            "messagesUsed": [
                "{n} мессеж",
                "{n} мессеж",
                "{n} мессеж"
            ],
            "messagesTotal": [
                "{n} мессеж",
                "{n} мессеж",
                "{n} мессеж"
            ],
            "storage": {
                "title": "Хадгалалт"
            },
            "imapDownload": {
                "title": "IMAP татаж авах",
                "comment": "өдөр бүр"
            },
            "imapUpload": {
                "title": "IMAP Байршуулах",
                "comment": "өдөр бүр"
            },
            "pop3Download": {
                "title": "POP3 татаж авах",
                "comment": "өдөр бүр"
            },
            "received": {
                "title": "Хүлээн авсан",
                "comment": "минутанд"
            },
            "recipients": {
                "title": "Илгээсэн",
                "comment": "өдөр бүр"
            },
            "forwards": {
                "title": "Дахин чиглүүлсэн",
                "comment": "өдөр бүр"
            }
        }
    },
    "filters": {
        "title": "Шүүлтүүрүүд",
        "commingSoon": "Тун удахгүй"
    }
};
exports.default = locale;
