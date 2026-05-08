declare const _default: {
    mail: {
        admin: string;
        bcc: string;
        sender: string;
        templatePath: string;
        rsvp: {
            sender: string;
            subject: Map<string, string>;
            text: Map<string, string>;
            html: Map<string, string>;
            attachments: Map<string, any[]>;
        };
    };
};
export default _default;
