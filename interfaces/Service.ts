export interface ServiceResponse<T> {
  content: T;
  error?: string;
  status: number;
  ok: boolean;
}
