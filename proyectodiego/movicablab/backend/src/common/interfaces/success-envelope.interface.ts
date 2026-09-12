export interface SuccessEnvelope<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
