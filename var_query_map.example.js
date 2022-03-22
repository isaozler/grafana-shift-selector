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
  },
  "static": {
    "shifts": [
      {
        "group": "Group 1 eg. Summer",
        "group_uuid": "uuid_1",
        "uuid": "shift_uuid_1",
        "label": "Morning Custom",
        "startTime": "06:00:00",
        "endTime": "14:00:00",
        "order": 1
      },
      {
        "group": "Group 2 eg. Winter",
        "group_uuid": "uuid_2",
        "uuid": "shift_uuid_2",
        "label": "Afternoon Custom",
        "startTime": "14:00:00",
        "endTime": "22:00:00",
        "order": 1
      },
      {
        "group": "Group 2 eg. Winter",
        "group_uuid": "uuid_2",
        "uuid": "shift_uuid_3",
        "label": "Night Custom",
        "startTime": "22:00:00",
        "endTime": "06:00:00",
        "order": 2
      }
    ]
  }
}
