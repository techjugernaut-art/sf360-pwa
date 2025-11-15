import { JsonProperty } from '../utils/json-property-decorator';

export class ResponseOjbect<T> {
  @JsonProperty('count')
  count?: number;
  @JsonProperty('next')
  next?: string;
  @JsonProperty('previous')
  previous?: string;
  @JsonProperty('message')
  message?: string;
  @JsonProperty('response_code')
  response_code?: string;
  @JsonProperty('status')
  status?: string;
  results?: T;
}
