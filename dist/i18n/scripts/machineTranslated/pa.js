"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "ਇਨਬਾਕਸ",
            "sent": "ਭੇਜਿਆ",
            "drafts": "ਡਰਾਫਟ",
            "trash": "ਰੱਦੀ",
            "junk": "ਸਪੈਮ"
        },
        "empty": "ਇਹ ਮੇਲਬਾਕਸ ਖਾਲੀ ਹੈ"
    },
    "message": {
        "labels": {
            "from": "ਵੱਲੋਂ:",
            "to": "ਨੂੰ:",
            "date": "ਭੇਜਿਆ ਗਿਆ:"
        }
    },
    "mailboxMessage": {
        "to": "ਨੂੰ:"
    },
    "login": {
        "title": "ਸਾਈਨ - ਇਨ",
        "action": "ਸਾਈਨ - ਇਨ",
        "labels": {
            "username": "ਉਪਯੋਗਕਰਤਾ ਨਾਮ",
            "password": "ਪਾਸਵਰਡ"
        }
    },
    "accountButton": {
        "logout": "ਸਾਇਨ ਆਉਟ"
    },
    "compose": {
        "labels": {
            "to": "ਨੂੰ:",
            "subject": "ਵਿਸ਼ਾ:",
            "cc": "ਸੀ ਸੀ:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "ਨਵਾਂ ਸੁਨੇਹਾ"
        }
    },
    "editor": {
        "cmd": {
            "undo": "ਵਾਪਿਸ",
            "redo": "ਦੁਬਾਰਾ ਕਰੋ",
            "fontName": "ਫੋਂਟ ਕਿਸਮ",
            "fontSize": "ਫੋਂਟ ਅਕਾਰ",
            "bold": "ਬੋਲਡ",
            "italic": "ਇਟੈਲਿਕ",
            "underline": "ਰੇਖਾ",
            "justifyLeft": "ਖੱਬੇ ਪਾਸੇ ਇਕਸਾਰ ਕਰੋ",
            "justifyCenter": "ਮੱਧ ਨੂੰ ਇਕਸਾਰ ਕਰੋ",
            "justifyRight": "ਸੱਜੇ ਅਲਾਈਨ ਕਰੋ",
            "insertUnorderedList": "ਸੂਚੀ",
            "insertOrderedList": "ਨੰਬਰ ਸੂਚੀ",
            "removeFormat": "ਫਾਰਮੈਟ ਹਟਾਓ"
        },
        "color": {
            "tooltip": "ਰੰਗ",
            "foreColor": "ਟੈਕਸਟ",
            "backColor": "ਪਿਛੋਕੜ"
        },
        "upload": {
            "tooltip": "ਨੱਥੀ ਕਰੋ",
            "add": "ਸ਼ਾਮਲ ਕਰੋ",
            "remove": "ਹਟਾਓ"
        },
        "send": "ਭੇਜੋ"
    },
    "selection": {
        "title": [
            "} n} ਸੁਨੇਹੇ",
            "} n} ਸੁਨੇਹਾ",
            "} n} ਸੁਨੇਹੇ"
        ]
    },
    "actions": {
        "backToMailbox": "ਮੇਲਬਾਕਸ ਤੇ ਵਾਪਸ",
        "reload": "ਮੁੜ ਲੋਡ ਕਰੋ",
        "select": "ਚੁਣੋ",
        "markAsUnread": "ਨਾ ਪੜ੍ਹੇ ਹੋਏ ਵਜੋਂ ਮਾਰਕ ਕਰੋ",
        "markAsRead": "ਪੜ੍ਹੇ ਦੇ ਤੌਰ ਤੇ ਮਾਰਕ ਕਰੋ",
        "moveTo": "ਨੂੰ ਭੇਜੋ",
        "delete": "ਮਿਟਾਓ",
        "deletePermanently": "ਪੱਕੇ ਤੌਰ ਤੇ ਹਟਾਓ",
        "discardDrafts": "ਡਰਾਫਟ ਛੱਡੋ",
        "markAsSpam": "ਸਪੈਮ ਦੇ ਤੌਰ ਤੇ ਮਾਰਕ ਕਰੋ",
        "unMarkAsSpam": "ਇਹ ਸਪੈਮ ਨਹੀਂ ਹੈ",
        "forward": "ਅੱਗੇ",
        "reply": "ਜਵਾਬ",
        "attachments": "ਨੱਥੀ"
    },
    "weekDays": {
        "0": "ਐਤਵਾਰ",
        "1": "ਸੋਮਵਾਰ",
        "2": "ਮੰਗਲਵਾਰ",
        "3": "ਬੁੱਧਵਾਰ",
        "4": "ਵੀਰਵਾਰ ਨੂੰ",
        "5": "ਸ਼ੁੱਕਰਵਾਰ",
        "6": "ਸ਼ਨੀਵਾਰ"
    },
    "months": {
        "0": "ਜਨਵਰੀ",
        "1": "ਫਰਵਰੀ",
        "2": "ਮਾਰਚ",
        "3": "ਅਪ੍ਰੈਲ",
        "4": "ਮਈ",
        "5": "ਜੂਨ",
        "6": "ਜੁਲਾਈ",
        "7": "ਅਗਸਤ",
        "8": "ਸਤੰਬਰ",
        "9": "ਅਕਤੂਬਰ",
        "10": "ਨਵੰਬਰ",
        "11": "ਦਸੰਬਰ"
    }
};
exports.default = locale;
