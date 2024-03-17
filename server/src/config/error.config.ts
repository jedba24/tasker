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
  public status: keyof typeof errorCodes;
  constructor({ status, message }: CustomErrorProps) {
    super(message);
    this.status = status;
  }
}
