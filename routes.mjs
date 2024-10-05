import { RouteList } from '@lionrockjs/router';

RouteList.add('/admin/rsvp', 'controller/admin/RSVP');
RouteList.add('/admin/rsvp/send/:id', 'controller/admin/RSVP', 'send_email');