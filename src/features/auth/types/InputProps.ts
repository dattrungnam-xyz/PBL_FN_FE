export default interface InputProps {
  id?: string;
  name?: string;
  label: string;
  value?: unknown;
  placeholder?: string;
  validationError?: string;
  gap?: number;
  requiredSign?: boolean;
}
