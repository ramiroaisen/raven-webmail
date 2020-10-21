"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    mailbox: {
        title: {
            inbox: "Inbox",
            sent: "Sent",
            drafts: "Drafts",
            trash: "Trash",
            junk: "Spam",
        },
        delete: "Delete folder",
        empty: "This mailbox is empty",
    },
    message: {
        labels: {
            from: "From:",
            to: "To:",
            date: "Sent:"
        }
    },
    mailboxMessage: {
        to: "To:"
    },
    login: {
        title: "Sign in",
        action: "Sign in",
        labels: {
            username: "Username",
            password: "Password",
        }
    },
    accountButton: {
        logout: "Sign out",
        myAccount: "My account",
        filters: "Filters",
    },
    compose: {
        labels: {
            to: "To:",
            subject: "Subject:",
            cc: "Cc:",
            bcc: "Bcc:",
        },
        tabs: {
            newMessageTitle: "New message"
        },
    },
    editor: {
        cmd: {
            undo: "Undo",
            redo: "Redo",
            fontName: "Font type",
            fontSize: "Font size",
            bold: "Bold",
            italic: "Italic",
            underline: "Underline",
            justifyLeft: "Align left",
            justifyCenter: "Align middle",
            justifyRight: "Align right",
            insertUnorderedList: "List",
            insertOrderedList: "Numbered list",
            removeFormat: "Remove format",
        },
        color: {
            tooltip: "Color",
            foreColor: "Text",
            backColor: "Background"
        },
        upload: {
            tooltip: "Attach",
            add: "Add",
            remove: "Remove",
        },
        send: "Send",
    },
    selection: {
        title: [
            "{n} messages",
            "{n} message",
            "{n} messages",
        ],
    },
    actions: {
        backToMailbox: "Back to mailbox",
        reload: "Refresh",
        select: "Select",
        markAsUnread: "Mark as not read",
        markAsRead: "Mark as read",
        moveTo: "Move to",
        delete: "Delete",
        deletePermanently: "Delete permanently",
        discardDrafts: "Discard drafts",
        markAsSpam: "Mark as spam",
        unMarkAsSpam: "This is not spam",
        forward: "Forward",
        reply: "Reply",
        attachments: "Attachments"
    },
    weekDays: {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    },
    months: {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "Jun",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December",
    },
    notifier: {
        messageSent: "Message sent",
        mailboxDeleted: "Folder deleted"
    },
    drawerActions: {
        createMailbox: {
            label: "New folder",
            success: "Folder created"
        }
    },
    dialogs: {
        createMailbox: {
            title: "Create new folder",
            label: "Folder name",
            accept: "Create",
            cancel: "Cancel"
        },
        deleteMailbox: {
            title: 'Delete folder "{mailbox}"',
            desc: "Caution. This action will delete permanently all messages in the folder",
            accept: "Delete",
            cancel: "Cancel"
        }
    },
    myAccount: {
        title: "My account",
        commonActions: {
            title: "Common actions",
            updatePassword: "Update password",
            currentPassword: "Current password",
            newPassword: "New password",
            confirmPassword: "Confirm new password",
        },
        limits: {
            gbUsed: "{gb} GB",
            gbTotal: "of {gb} GB",
            messagesUsed: [
                "{n} messages",
                "{n} message",
                "{n} messages"
            ],
            messagesTotal: [
                "of {n} messages",
                "of {n} message",
                "of {n} messages"
            ],
            storage: {
                title: "Storage"
            },
            imapDownload: {
                title: "IMAP Download",
                comment: "daily"
            },
            imapUpload: {
                title: "IMAP Upload",
                comment: "daily"
            },
            pop3Download: {
                title: "POP3 Download",
                comment: "daily",
            },
            received: {
                title: "Received",
                comment: "by minute"
            },
            recipients: {
                title: "Sent",
                comment: "daily"
            },
            forwards: {
                title: "Redirected",
                comment: "daily"
            }
        }
    },
    filters: {
        title: "Filters",
        commingSoon: "Coming soon"
    }
};
exports.default = locale;
