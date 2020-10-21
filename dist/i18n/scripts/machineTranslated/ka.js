"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Შემომავალი",
            "sent": "Გაგზავნილი",
            "drafts": "ნახაზები",
            "trash": "ნაგავი",
            "junk": "Სპამი"
        },
        "delete": "საქაღალდის წაშლა",
        "empty": "ეს საფოსტო ყუთი ცარიელია"
    },
    "message": {
        "labels": {
            "from": "აქედან:",
            "to": "To:",
            "date": "Გაგზავნილი:"
        }
    },
    "mailboxMessage": {
        "to": "To:"
    },
    "login": {
        "title": "Შესვლა",
        "action": "Შესვლა",
        "labels": {
            "username": "ნიკი",
            "password": "პაროლი"
        }
    },
    "accountButton": {
        "logout": "Სისტემიდან გამოსვლა",
        "myAccount": "Ჩემი ანგარიში",
        "filters": "ფილტრები"
    },
    "compose": {
        "labels": {
            "to": "To:",
            "subject": "თემა:",
            "cc": "Cc:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "Ახალი შეტყობინება"
        }
    },
    "editor": {
        "cmd": {
            "undo": "გაუქმება",
            "redo": "ხელახლა",
            "fontName": "შრიფტის ტიპი",
            "fontSize": "Შრიფტის ზომა",
            "bold": "თამამი",
            "italic": "იტალიური",
            "underline": "ხაზს უსვამს",
            "justifyLeft": "გასწორება მარცხნივ",
            "justifyCenter": "შუა გასწორება",
            "justifyRight": "გასწორება მარჯვნივ",
            "insertUnorderedList": "ჩამოთვლა",
            "insertOrderedList": "დათვლილი სია",
            "removeFormat": "ფორმატის ამოღება"
        },
        "color": {
            "tooltip": "ფერი",
            "foreColor": "ტექსტი",
            "backColor": "ფონი"
        },
        "upload": {
            "tooltip": "მიმაგრება",
            "add": "დამატება",
            "remove": "ამოიღეთ"
        },
        "send": "გაგზავნა"
    },
    "selection": {
        "title": [
            "{n} შეტყობინებები",
            "{n} გაგზავნა",
            "{n} შეტყობინებები"
        ]
    },
    "actions": {
        "backToMailbox": "საფოსტო ყუთში დაბრუნება",
        "reload": "განახლება",
        "select": "შეარჩიეთ",
        "markAsUnread": "მონიშნეთ, როგორც არ წაკითხული",
        "markAsRead": "მონიშნეთ წაკითხული",
        "moveTo": "Გადასვლა",
        "delete": "წაშლა",
        "deletePermanently": "სამუდამოდ წაშლა",
        "discardDrafts": "გაუქმება მონახაზები",
        "markAsSpam": "მონიშნე როგორც სპამი",
        "unMarkAsSpam": "ეს არ არის სპამი",
        "forward": "წინ",
        "reply": "პასუხი",
        "attachments": "დანართები"
    },
    "weekDays": {
        "0": "კვირა",
        "1": "ორშაბათს",
        "2": "სამშაბათს",
        "3": "ოთხშაბათს",
        "4": "ხუთშაბათი",
        "5": "პარასკევი",
        "6": "შაბათს"
    },
    "months": {
        "0": "იანვარი",
        "1": "თებერვალი",
        "2": "მარტი",
        "3": "აპრილი",
        "4": "მაისი",
        "5": "ივნ",
        "6": "ივლისი",
        "7": "აგვისტო",
        "8": "სექტემბერი",
        "9": "ოქტომბერი",
        "10": "ნოემბერი",
        "11": "დეკემბერი"
    },
    "notifier": {
        "messageSent": "Შეტყობინება გაგზავნილია",
        "mailboxDeleted": "საქაღალდე წაიშალა"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "Ახალი საქაღალდე",
            "success": "საქაღალდე შექმნა"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "შექმენით ახალი საქაღალდე",
            "label": "Საქაღალდის სახელი",
            "accept": "Შექმნა",
            "cancel": "გაუქმება"
        },
        "deleteMailbox": {
            "title": "საქაღალდის წაშლა \"{mailbox}\"",
            "desc": "Სიფრთხილით. ეს მოქმედება სამუდამოდ წაშლის საქაღალდეში არსებულ ყველა შეტყობინებას",
            "accept": "წაშლა",
            "cancel": "გაუქმება"
        }
    },
    "myAccount": {
        "title": "Ჩემი ანგარიში",
        "commonActions": {
            "title": "საერთო მოქმედებები",
            "updatePassword": "განაახლეთ პაროლი",
            "currentPassword": "Მიმდინარე პაროლი",
            "newPassword": "Ახალი პაროლი",
            "confirmPassword": "Დაადასტურეთ ახალი პაროლი"
        },
        "limits": {
            "gbUsed": "1} GB",
            "gbTotal": "{gb} GB",
            "messagesUsed": [
                "{n} შეტყობინებები",
                "{n} გაგზავნა",
                "{n} შეტყობინებები"
            ],
            "messagesTotal": [
                "{n} შეტყობინებიდან",
                "{n} გაგზავნისგან",
                "{n} შეტყობინებიდან"
            ],
            "storage": {
                "title": "შენახვა"
            },
            "imapDownload": {
                "title": "IMAP ჩამოტვირთვა",
                "comment": "ყოველდღიურად"
            },
            "imapUpload": {
                "title": "IMAP ატვირთვა",
                "comment": "ყოველდღიურად"
            },
            "pop3Download": {
                "title": "POP3 ჩამოტვირთვა",
                "comment": "ყოველდღიურად"
            },
            "received": {
                "title": "მიიღო",
                "comment": "წუთით"
            },
            "recipients": {
                "title": "Გაგზავნილი",
                "comment": "ყოველდღიურად"
            },
            "forwards": {
                "title": "გადამისამართება",
                "comment": "ყოველდღიურად"
            }
        }
    },
    "filters": {
        "title": "ფილტრები",
        "commingSoon": "Მალე"
    }
};
exports.default = locale;
