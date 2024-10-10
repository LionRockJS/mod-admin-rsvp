import {Controller} from '@lionrockjs/mvc';
import {ControllerAdmin} from '@lionrockjs/mod-admin';
import {Central, ORM, ControllerMixinDatabase} from '@lionrockjs/central';
import {ControllerMixinORMRead} from "@lionrockjs/mixin-orm";

import {ModelLead} from '@lionrockjs/mod-cold-leads';
const Lead = await ORM.import('Lead', ModelLead);
import LeadInfo from '../../model/LeadInfo.mjs';

import HelperRSVP from '../../helper/RSVP.mjs';


export default class ControllerAdminRSVP extends ControllerAdmin {
  constructor(request) {
    super(request, Lead, {
      roles: new Set(['staff', 'moderator']),
      databases: new Map([
        ['guest',      Central.config.rsvp.databasePath+'/guest/lead.sqlite'],
        ['guest_info', Central.config.rsvp.databasePath+'/guest/lead_info.sqlite'],
        ['guest_action', Central.config.rsvp.databasePath+'/guest/lead_action.sqlite'],
        ['mail',       Central.config.mail.databasePath+'/'+ Central.config.mail.database]
      ]),
      templates: new Map([
        ['index', 'templates/admin/guests/index'],
        ['read', 'templates/admin/guests/read'],
        ['edit', 'templates/admin/guests/read'],
      ]),
      database: 'guest',
      pagesize: 50,
    });
  }

  async action_index() {
    const databases = this.state.get(ControllerMixinDatabase.DATABASES);
    const dbInfo = databases.get('guest_info');

    const instances = this.state.get(ControllerMixinORMRead.INSTANCES);

    await Promise.all(instances.map(async it => {
      const info = await ORM.factory(LeadInfo, it.id, {database: dbInfo});

      Object.assign(it, {
        last_name: info.last_name,
        cc: info.cc,
        rsvp_code: info.rsvp_code,
        salutation: info.salutation,
      });
    }));
  }

  async action_send_email(){
    Central.log(this.state.get(Controller.STATE_QUERY), false);
    const {id} = this.state.get(Controller.STATE_PARAMS);

    const databases = this.state.get(ControllerMixinDatabase.DATABASES);
    const database = databases.get('guest');
    const instance = await ORM.factory(Lead, id, {database});

    const dbInfo = databases.get('guest_info');
    const info = await ORM.factory(LeadInfo, instance.id, {database: dbInfo});

    Object.assign(instance, {
      last_name: info.last_name,
      cc: info.cc
    });

    const helperRegister = new HelperRSVP(
      databases.get('guest'),
      databases.get('guest_action'),
      databases.get('mail'),
      this.state.get(Controller.STATE_CLIENT_IP),
      this.state.get(Controller.STATE_HOSTNAME)
    )

    await helperRegister.sendRSVP(instance, Central.config.edm);
    info.rsvp_code = "111.111.111";
    await info.write();

    await this.redirect(this.state.get(Controller.STATE_CHECKPOINT) || '/admin/rsvp/');
  }

  async action_read(){

  }
}