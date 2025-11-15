import { JsonProperty } from 'src/app/utils/json-property-decorator';

export class PriceListModel {
  @JsonProperty('id')
  id: number;
  @JsonProperty('unit_name')
  unit_name?: string;
  @JsonProperty('is_base_unit')
  is_base_unit?: boolean;
  @JsonProperty('selling_price')
  selling_price?: string;
  @JsonProperty('supplier_price')
  supplier_price?: string;
  @JsonProperty('base_unit_multiplier')
  base_unit_multiplier?: string;
}
