export interface iUser {
  id?: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  address: Address;
  cart: number[];
  wishlist: number[];
  roles?:Role[];
  avatar?: string;
}

export interface Address {
  city: string;
  toponym: string;
  addressName: string;
  streetNumber: string;
  zipCode: string;
  phoneNumber: string;
}

export interface Role{
  id: number;
  roleType: string;
}
