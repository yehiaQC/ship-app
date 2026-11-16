/**
 * Test data in one place. Credentials come from environment variables (.env).
 */
const suffix = (): string => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const users = {
  /** Seeded Saudi user (see ship-app/README.md, "Logging in"). */
  ksa: {
    email: process.env.E2E_USER_EMAIL ?? 'ksa@qacart.com',
    password: process.env.E2E_USER_PASSWORD ?? '',
    fullName: 'Khalid Al-Otaibi',
    country: 'Saudi Arabia',
  },
};

export interface ReceiverData {
  name: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface PackageData {
  weight: number;
  length: number;
  width: number;
  height: number;
}

/** Saudi Arabia -> UAE is an IntraGulf shipment. The name is unique so the test finds its own row. */
export const intraGulfReceiver = (): ReceiverData => ({
  name: `E2E Receiver ${suffix()}`,
  phone: '0501234567',
  country: 'United Arab Emirates',
  city: 'Dubai',
  street: 'Sheikh Zayed Road 12',
  postalCode: '00000',
});

/** 2 kg, well under every IntraGulf service limit. */
export const smallPackage: PackageData = { weight: 2, length: 30, width: 20, height: 10 };

export const services = { gulfStandard: /Gulf Standard/ };
