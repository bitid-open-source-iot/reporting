class ErrorResponse {

    constructor() {
        this.error = {
            'errors': [
                {
                    'code': 503,
                    'reason': 'General Error',
                    'message': 'General Error',
                    'location': 'General Error',
                    'locationType': 'General Error'
                }
            ],
            'code': 503,
            'message': 'General Error'
        };
    };

};

module.exports = ErrorResponse;