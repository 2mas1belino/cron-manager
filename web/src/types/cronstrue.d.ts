declare module "cronstrue" {
  export function toString(
    expression: string,
    options?: { use24HourTimeFormat?: boolean }
  ): string;
}