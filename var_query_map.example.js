/** 
 * @description: Modify this map and copy paste this in the panel 'var_query_map' variable contant value.
 * The project key contains the table shift_groups and shifts. Don't change the keys.
 * */

const var_query_map = {
  "project": {
    "shift_groups": {
      "name": "name",
      "uuid": "uuid",
      "site_uuid": "site_uuid"
    },
    "shifts": {
      "uuid": "uuid",
      "start_time": "start_time",
      "end_time": "end_time",
      "order": "shift_order",
      "group_uuid": "shift_group_uuid"
    }
  },
  "lookup": {
    "shifts": "shifts",
    "shift_groups": "shift_groups"
  },
  "schema": {
    "shifts": "",
    "shift_groups": ""
  },
  "values": {
    "site_uuid": ""
  }
}
