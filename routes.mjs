import { RouteList } from '@lionrockjs/central';

RouteList.add('/admin/rsvp', 'controller/admin/RSVP');
RouteList.add('/admin/rsvp/send/:id', 'controller/admin/RSVP', 'send_email');