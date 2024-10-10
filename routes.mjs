import { RouteList } from '@lionrockjs/router';

RouteList.add('/admin/rsvp', 'controller/admin/RSVP');
RouteList.add('/admin/rsvp/send/:id', 'controller/admin/RSVP', 'send_email');
RouteList.add('/admin/leads/:id', 'controller/admin/RSVP', 'edit');
RouteList.add('/admin/leads/:id', 'controller/admin/RSVP', 'update', 'POST');