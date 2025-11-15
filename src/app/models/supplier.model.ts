import { JsonProperty } from '../utils/json-property-decorator';

export class SupplierModel {
  @JsonProperty('id')
  id: number;
  @JsonProperty('date_created')
  date_created: Date;
  @JsonProperty('name')
  name?: string;
  @JsonProperty('phone_number')
  phone_number?: string;
  @JsonProperty('physical_address')
  physical_address?: string;
  @JsonProperty('is_foresight_supplier')
  is_foresight_supplier?: boolean;
}
