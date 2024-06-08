class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "Not Found";
    this.code = 404;
  }
}

class BadRequestException extends Error {
  constructor(message) {
    super(message);
    this.name = "Bad request";
    this.code = 400;
  }
}

class BadGatewayException extends Error {
  constructor(message) {
    super(message);
    this.name = "Gateway error";
    this.code = 502;
  }
}

class UnAuthorizedException extends Error {
  constructor(message) {
    super(message);
    this.name = "Unauthorized action";
    this.code = 401;
  }
}

class ForbiddenException extends Error {
  constructor(message) {
    super(message);
    this.name = "Forbidden action";
    this.code = 403;
  }
}

module.exports = {
  NotFoundException,
  BadRequestException,
  BadGatewayException,
  UnAuthorizedException,
  ForbiddenException,
};
