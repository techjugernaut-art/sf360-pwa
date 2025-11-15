import { JsonProperty } from "../utils/json-property-decorator";

export class User {
  id: string;
  auth_token: string;
  email: string;
  username: string;
  avatar: string;
  full_name: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone_number: string;
  last_login_time: string;
  address: string;
  last_login_location: string;
  last_login_terminal: string;
  created: string;
  is_active: boolean;
  is_blocked: boolean;
  password_changed: boolean;
  can_give_discount: boolean;
  is_shop_admin: boolean;
  is_shop_agent: boolean;
  unique_code: string;
  first_user: boolean;
  is_foresight_supplier: boolean;
  is_foresight_user: boolean;
  kpi_insight: boolean;
  market_gist: boolean;
  market_comparator: boolean;
  intellisight: boolean;
  supply_order: boolean;
  sales_log: boolean;
  is_admin_junior_staff: boolean;
  is_admin_senior_staff: boolean;
  is_admin_superuser: boolean;
  needs_walkthrough: boolean;
}
