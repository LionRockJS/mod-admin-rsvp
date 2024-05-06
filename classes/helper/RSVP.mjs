import path from 'node:path';
import {ORM, Central}  from '@lionrockjs/central';
import {ORMAdapterSQLite}  from "@lionrockjs/adapter-database-better-sqlite3";
import {Mail}  from '@lionrockjs/mod-mail';
import {MailAdapterAWS}  from '@lionrockjs/adapter-mail-aws';

import {ModelLeadAction} from '@lionrockjs/mod-cold-leads';

export default class HelperRSVP {
  constructor(leadDB, leadActionDB, mailDB, clientIP, landing) {
    this.leadDB = leadDB;
    this.leadActionDB = leadActionDB;
    this.helperMail = new Mail({
      database: mailDB,
      ormAdapter : ORMAdapterSQLite,
      adapter : MailAdapterAWS,
      templateFolder : path.normalize(Central.config.edm.mail.templatePath)
    });
    this.clientIP = clientIP;
    this.landing = landing;
  }

  async sendEDM(type, instance, config){
    if(!config.mail[type]){
      throw new Error(`EDM Mail config for ${type} not found`);
    }
    const language = instance.language;
    const userEmail = instance.contact;
    const sender  = config.mail[type].sender;
    const subject = config.mail[type].subject.get(language);
    const text    = config.mail[type].text.get(language);
    const html    = config.mail[type].html.get(language);
    const attachments = config.mail[type].attachments?.get(language);

    const tokens = Object.assign(
      {
        domain: this.landing,
        language: language,
      },
      instance,
      {
        email: userEmail.replaceAll('.', '<span>.</span>'),
        salutation: config.salutation.get(language).get(instance.salutation?.toLowerCase()) || "",
      });

    console.log("bcc:", config.mail.bcc);
    const result = await this.helperMail.send(subject, text, sender, userEmail, {
      cc: instance.cc.split(','),
      bcc: config.mail.bcc,
      html,
      tokens,
      attachments
    });

    await this.addNotification(type, result, instance.id);
  }

  async sendRSVP(instance, config){
    await this.sendEDM('rsvp', instance, config);
  }

  async sendReminder(instance, config){
    await this.sendEDM('reminder', instance, config);
  }

  async addNotification(name, result, leadID){
    const note = ORM.create(ModelLeadAction, {database: this.leadActionDB});
    note.lead_id = leadID;
    note.name = name;
    note.ip = this.clientIP;
    note.payload = JSON.stringify(result);
    await note.write();
  }
}