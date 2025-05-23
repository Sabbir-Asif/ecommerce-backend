import { ErrorCode, HttpException } from "./root";

export class NoContentException extends HttpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message, errorCode, 204, null);
    }
}