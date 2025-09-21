/**
 * Thrown when an error occurs during an AJAX request.
 * This is only exported because it is useful for checking to see if an error
 * is an `instanceof AjaxError`. DO NOT create new instances of `AjaxError` with
 * the constructor.
 *
 * @see {@link ajax}
 */
export class AjaxError extends Error {
    /**
     * The XHR instance associated with the error.
     */
    xhr;
    /**
     * The AjaxRequest associated with the error.
     */
    request;
    /**
     * The HTTP status code, if the request has completed. If not,
     * it is set to `0`.
     */
    status;
    /**
     * The responseType (e.g. 'json', 'arraybuffer', or 'xml').
     */
    responseType;
    /**
     * The response data.
     */
    response;
    /**
     * @deprecated Internal implementation detail. Do not construct error instances.
     * Cannot be tagged as internal: https://github.com/ReactiveX/rxjs/issues/6269
     */
    constructor(message, xhr, request) {
        super(message);
        this.name = 'AjaxError';
        this.xhr = xhr;
        this.request = request;
        this.status = xhr.status;
        this.responseType = xhr.responseType;
        this.response = xhr.response;
    }
}
/**
 * Thrown when an AJAX request times out. Not to be confused with {@link TimeoutError}.
 *
 * This is exported only because it is useful for checking to see if errors are an
 * `instanceof AjaxTimeoutError`. DO NOT use the constructor to create an instance of
 * this type.
 *
 * @see {@link ajax}
 */
export class AjaxTimeoutError extends AjaxError {
    /**
     * @deprecated Internal implementation detail. Do not construct error instances.
     * Cannot be tagged as internal: https://github.com/ReactiveX/rxjs/issues/6269
     */
    constructor(xhr, request) {
        super('ajax timeout', xhr, request);
        this.name = 'AjaxTimeoutError';
    }
}
