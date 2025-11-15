export interface BulkCustomerUploadData {
  name: string;
  phone_number: string;
  email: string;
  address: string;
}
/**
 * Product Upload Columns mapping (server_name to client_name)
 */
export const bulkCustomerUploadColumnNames = [
  {server_name: 'name', client_name: 'Name'},
  {server_name: 'phone_number', client_name: 'Phone Number'},
  {server_name: 'email', client_name: 'Email'},
  {server_name: 'address', client_name: 'Address'}
];
