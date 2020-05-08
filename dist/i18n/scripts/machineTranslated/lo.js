"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "ກ່ອງຈົດ ໝາຍ",
            "sent": "ສົ່ງແລ້ວ",
            "drafts": "ຮ່າງຕ່າງໆ",
            "trash": "ຂີ້ເຫຍື້ອ",
            "junk": "ສະແປມ"
        },
        "delete": "ລຶບໂຟນເດີ",
        "empty": "ກ່ອງຈົດ ໝາຍ ນີ້ແມ່ນຫວ່າງເປົ່າ"
    },
    "message": {
        "labels": {
            "from": "ຈາກ:",
            "to": "ເຖິງ:",
            "date": "ສົ່ງແລ້ວ:"
        }
    },
    "mailboxMessage": {
        "to": "ເຖິງ:"
    },
    "login": {
        "title": "ເຂົ້າ​ສູ່​ລະ​ບົບ",
        "action": "ເຂົ້າ​ສູ່​ລະ​ບົບ",
        "labels": {
            "username": "ຊື່ຜູ້ໃຊ້",
            "password": "ລະຫັດຜ່ານ"
        }
    },
    "accountButton": {
        "logout": "ອອກ​ຈາກ​ລະ​ບົບ",
        "myAccount": "ບັນ​ຊີ​ຂອງ​ຂ້ອຍ"
    },
    "compose": {
        "labels": {
            "to": "ເຖິງ:",
            "subject": "ຫົວຂໍ້:",
            "cc": "Cc:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "ຂໍ້ຄວາມ ໃໝ່"
        }
    },
    "editor": {
        "cmd": {
            "undo": "ຍົກເລີກ",
            "redo": "ເຮັດອີກແລ້ວ",
            "fontName": "ປະເພດຕົວອັກສອນ",
            "fontSize": "ຂະ ໜາດ ຕົວອັກສອນ",
            "bold": "ກ້າຫານ",
            "italic": "ໂຕເນີ້ງ",
            "underline": "ຂີດ​ກ້ອງ",
            "justifyLeft": "ຈັດລຽນທາງຊ້າຍ",
            "justifyCenter": "ຈັດຮຽງກາງ",
            "justifyRight": "ຈັດລຽນຂວາ",
            "insertUnorderedList": "ລາຍຊື່",
            "insertOrderedList": "ບັນຊີລາຍຊື່ນັບ",
            "removeFormat": "ເອົາຮູບແບບອອກ"
        },
        "color": {
            "tooltip": "ສີ",
            "foreColor": "ຂໍ້​ຄວາມ",
            "backColor": "ຄວາມເປັນມາ"
        },
        "upload": {
            "tooltip": "ແນບ",
            "add": "ຕື່ມ",
            "remove": "ເອົາອອກ"
        },
        "send": "ສົ່ງ"
    },
    "selection": {
        "title": [
            "{n} ຂໍ້ຄວາມ",
            "{n} ຂໍ້ຄວາມ",
            "{n} ຂໍ້ຄວາມ"
        ]
    },
    "actions": {
        "backToMailbox": "ກັບໄປທີ່ກ່ອງຈົດ ໝາຍ",
        "reload": "ໂຫຼດຫນ້າຈໍຄືນ",
        "select": "ເລືອກ",
        "markAsUnread": "ໝາຍ ໄວ້ວ່າບໍ່ໄດ້ອ່ານ",
        "markAsRead": "ໝາຍ ວ່າອ່ານແລ້ວ",
        "moveTo": "ຍ້າຍ​ໄປ",
        "delete": "ລົບ",
        "deletePermanently": "ລົບຖາວອນ",
        "discardDrafts": "ຍົກເລີກຮ່າງຕ່າງໆ",
        "markAsSpam": "ໝາຍ ວ່າ spam",
        "unMarkAsSpam": "ນີ້ບໍ່ແມ່ນສະແປມ",
        "forward": "ສົ່ງຕໍ່",
        "reply": "ຕອບ",
        "attachments": "ເອກະສານຕິດຄັດ"
    },
    "weekDays": {
        "0": "ວັນອາທິດ",
        "1": "ວັນຈັນ",
        "2": "ວັນອັງຄານ",
        "3": "ວັນພຸດ",
        "4": "ວັນພະຫັດ",
        "5": "ວັນ​ສຸກ",
        "6": "ວັນເສົາ"
    },
    "months": {
        "0": "ມັງກອນ",
        "1": "ກຸມພາ",
        "2": "ມີນາ",
        "3": "ເດືອນເມສາ",
        "4": "ພຶດສະພາ",
        "5": "ມິຖຸນາ",
        "6": "ເດືອນກໍລະກົດ",
        "7": "ສິງຫາ",
        "8": "ກັນຍາ",
        "9": "ເດືອນຕຸລາ",
        "10": "ພະຈິກ",
        "11": "ທັນວາ"
    },
    "notifier": {
        "messageSent": "ຂໍ້ຄວາມຖືກສົ່ງແລ້ວ",
        "mailboxDeleted": "ໂຟນເດີຖືກລຶບແລ້ວ"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "ໂຟນເດີ ໃໝ່",
            "success": "ແຟ້ມສ້າງ"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "ສ້າງໂຟນເດີ ໃໝ່",
            "label": "ຊື່ແຟ້ມ",
            "accept": "ສ້າງ",
            "cancel": "ຍົກເລີກ"
        },
        "deleteMailbox": {
            "title": "ລຶບໂຟເດີ \"{mailbox}\"",
            "desc": "ຂໍ້ຄວນລະວັງ. ການກະ ທຳ ນີ້ຈະລຶບຂໍ້ຄວາມທັງ ໝົດ ໃນໂຟນເດີຖາວອນ",
            "accept": "ລົບ",
            "cancel": "ຍົກເລີກ"
        }
    },
    "myAccount": {
        "title": "ບັນ​ຊີ​ຂອງ​ຂ້ອຍ",
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "ຂອງ {gb} GB",
            "messagesUsed": [
                "{n} ຂໍ້ຄວາມ",
                "{n} ຂໍ້ຄວາມ",
                "{n} ຂໍ້ຄວາມ"
            ],
            "messagesTotal": [
                "ຂອງ {n} ຂໍ້ຄວາມ",
                "ຂອງ {n} ຂໍ້ຄວາມ",
                "ຂອງ {n} ຂໍ້ຄວາມ"
            ],
            "storage": {
                "title": "ບ່ອນເກັບມ້ຽນ"
            },
            "imapDownload": {
                "title": "ດາວໂຫລດ IMAP",
                "comment": "ປະຈໍາວັນ"
            },
            "imapUpload": {
                "title": "IMAP ອັບໂຫລດ",
                "comment": "ປະຈໍາວັນ"
            },
            "pop3Download": {
                "title": "POP3 ດາວໂຫລດ",
                "comment": "ປະຈໍາວັນ"
            },
            "received": {
                "title": "ໄດ້ຮັບ",
                "comment": "ໂດຍນາທີ"
            },
            "recipients": {
                "title": "ສົ່ງແລ້ວ",
                "comment": "ປະຈໍາວັນ"
            },
            "forwards": {
                "title": "ປ່ຽນເສັ້ນທາງ",
                "comment": "ປະຈໍາວັນ"
            }
        }
    }
};
exports.default = locale;
