const errorCodes = {
  BAD_REQUEST: 400,
  NOT_AUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
type CustomErrorProps = {
  message: string;
  status: keyof typeof errorCodes;
};
export default class CustomError extends Error {
  public statusCode: number;
  constructor({ status, message }: CustomErrorProps) {
    super(message);
    this.statusCode = errorCodes[status as keyof typeof errorCodes];
  }
}
