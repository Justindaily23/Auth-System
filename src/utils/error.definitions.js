export class NotFoundException extends Error{
    constructor(message){
        super(message);
        this.name = 'NoContentException';
        this.status = 204;
}

}

export class ConflictException extends Error{
    constructor(message){
        super(message);
        this.name = 'Conflict Occcured'
        this.status = 409;
    }
}

export class UnauthorizedException extends Error{
    constructor( message ) {
        
        super(message);

        this.name = 'Unauthorized Exception';
        this.status = 401;
    }
}

export class BadRequestException extends Error {
    constructor( message ) {
        super(message);
        this.status = 400;
        this.name = "BadRequestException";
    }
}