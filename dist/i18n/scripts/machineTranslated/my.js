"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Inbox",
            "sent": "ပို့ခဲ့သည်",
            "drafts": "မူကြမ်းများ",
            "trash": "အမှိုက်ပုံး",
            "junk": "Spam များကို"
        },
        "delete": "ဖိုလ်ဒါကိုဖျက်ပါ",
        "empty": "ဤစာတိုက်ပုံးသည်ဗလာဖြစ်သည်"
    },
    "message": {
        "labels": {
            "from": "မှ:",
            "to": "သို့:",
            "date": "ပို့ပြီး"
        }
    },
    "mailboxMessage": {
        "to": "သို့:"
    },
    "login": {
        "title": "ဆိုင်းအင်လုပ်ခြင်း",
        "action": "ဆိုင်းအင်လုပ်ခြင်း",
        "labels": {
            "username": "အသုံးပြုသူအမည်",
            "password": "စကားဝှက်"
        }
    },
    "accountButton": {
        "logout": "ဆိုင်းအောက်",
        "myAccount": "ငါ့အကောင့်"
    },
    "compose": {
        "labels": {
            "to": "သို့:",
            "subject": "ဘာသာရပ် -",
            "cc": "စီစီ:",
            "bcc": "ဘီစီ:"
        },
        "tabs": {
            "newMessageTitle": "မက်ဆေ့ခ်ျအသစ်"
        }
    },
    "editor": {
        "cmd": {
            "undo": "ပယ်ဖျက်",
            "redo": "Redo",
            "fontName": "စာလုံးပုံစံ",
            "fontSize": "စာလုံးအရွယ်အစား",
            "bold": "ရဲရင့်",
            "italic": "စာလုံးစောင်း",
            "underline": "မျဉ်းကြောင်း",
            "justifyLeft": "left align လုပ်ပါ",
            "justifyCenter": "အလယ်ကို align",
            "justifyRight": "ညာဘက် align",
            "insertUnorderedList": "စာရင်း",
            "insertOrderedList": "စာရင်းစာရင်း",
            "removeFormat": "format ဖယ်ရှားပါ"
        },
        "color": {
            "tooltip": "အရောင်",
            "foreColor": "စာသား",
            "backColor": "နောက်ခံ"
        },
        "upload": {
            "tooltip": "ပူးတွဲပါ",
            "add": "ထည့်ပါ",
            "remove": "ဖယ်ရှားပါ"
        },
        "send": "ပို့ပါ"
    },
    "selection": {
        "title": [
            "{n} သတင်းစကား",
            "{n} သတင်းစကား",
            "{n} သတင်းစကား"
        ]
    },
    "actions": {
        "backToMailbox": "စာတိုက်ပုံးသို့ပြန်သွားပါ",
        "reload": "Refresh",
        "select": "ရွေးချယ်ပါ",
        "markAsUnread": "မဖတ်ရအဖြစ်မှတ်သားပါ",
        "markAsRead": "ဖတ်ပြီးသည့်အတိုင်းမှတ်သားပါ",
        "moveTo": "သို့ရွှေ့ပါ",
        "delete": "ဖျက်ပါ",
        "deletePermanently": "အမြဲတမ်းဖျက်ပါ",
        "discardDrafts": "မူကြမ်းများကိုဖယ်ရှားပါ",
        "markAsSpam": "spam အဖြစ်မှတ်သားပါ",
        "unMarkAsSpam": "ဒီဟာ spam မဟုတ်ပါ",
        "forward": "ရှေ့သို့",
        "reply": "ပြန်ပြောပါ",
        "attachments": "ပူးတွဲဖိုင်များ"
    },
    "weekDays": {
        "0": "တနင်္ဂနွေနေ့",
        "1": "တနင်္လာနေ့",
        "2": "အင်္ဂါနေ့",
        "3": "ဗုဒ္ဓဟူးနေ့",
        "4": "ကြာသပတေးနေ့",
        "5": "သောကြာနေ့",
        "6": "စနေနေ့"
    },
    "months": {
        "0": "ဇန်နဝါရီလ",
        "1": "ဖေဖော်ဝါရီလ",
        "2": "မတ်လ",
        "3": "ပြီလ",
        "4": "မေလ",
        "5": "ဇွန်",
        "6": "ဇူလိုင်လ",
        "7": "သြဂုတ်လ",
        "8": "စက်တင်ဘာ",
        "9": "အောက်တိုဘာ",
        "10": "နိုဝင်ဘာ",
        "11": "ဒီဇင်ဘာ"
    },
    "notifier": {
        "messageSent": "မက်ဆေ့ခ်ျပို့ခဲ့သည်",
        "mailboxDeleted": "ဖိုလ်ဒါကိုဖျက်လိုက်သည်"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "ဖိုင်တွဲအသစ်",
            "success": "ဖိုလ်ဒါဖန်တီးထားသည်"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "ဖိုင်တွဲအသစ်ဖန်တီးပါ",
            "label": "ဖိုလ်ဒါအမည်",
            "accept": "ဖန်တီးပါ",
            "cancel": "ပယ်ဖျက်ပါ"
        },
        "deleteMailbox": {
            "title": "ဖိုလ်ဒါကိုဖျက်ရန် \"{mailbox}\"",
            "desc": "သတိ။ ဤလုပ်ဆောင်ချက်သည်ဖိုင်တွဲရှိစာများအားလုံးကိုအမြဲတမ်းဖျက်ပစ်လိမ့်မည်",
            "accept": "ဖျက်ပါ",
            "cancel": "ပယ်ဖျက်ပါ"
        }
    },
    "myAccount": {
        "title": "ငါ့အကောင့်",
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "{gb} GB ကို၏",
            "messagesUsed": [
                "{n} သတင်းစကား",
                "{n} သတင်းစကား",
                "{n} သတင်းစကား"
            ],
            "messagesTotal": [
                "{n} မက်ဆေ့ခ်ျ၏",
                "{n} မက်ဆေ့ခ်ျကို၏",
                "{n} မက်ဆေ့ခ်ျ၏"
            ],
            "storage": {
                "title": "သိုလှောင်ခြင်း"
            },
            "imapDownload": {
                "title": "IMAP ဒေါင်းလုပ်",
                "comment": "နေ့စဉ်"
            },
            "imapUpload": {
                "title": "IMAP တင်ပါ",
                "comment": "နေ့စဉ်"
            },
            "pop3Download": {
                "title": "POP3 ဒေါင်းလုပ်",
                "comment": "နေ့စဉ်"
            },
            "received": {
                "title": "လက်ခံရရှိခဲ့သည်",
                "comment": "တစ်မိနစ်"
            },
            "recipients": {
                "title": "ပို့ခဲ့သည်",
                "comment": "နေ့စဉ်"
            },
            "forwards": {
                "title": "ပြန်ညွှန်း",
                "comment": "နေ့စဉ်"
            }
        }
    }
};
exports.default = locale;
