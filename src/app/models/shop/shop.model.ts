import { JsonProperty } from 'src/app/utils/json-property-decorator';

export class ShopModel {
  @JsonProperty('id')
  id: number;
  @JsonProperty('business_name')
  business_name: string;
  @JsonProperty('storefrontmall_name')
  storefrontmall_name?: string;
  @JsonProperty('location')
  location?: string;
  @JsonProperty('logo')
  logo?: string;
  @JsonProperty('self_managed_delivery')
  self_managed_delivery?: boolean;
  @JsonProperty('has_slider')
  has_slider?: boolean;
  @JsonProperty('mall_short_name')
  mall_short_name?: string;
  @JsonProperty('featured_image')
  featured_image?: string;
}
