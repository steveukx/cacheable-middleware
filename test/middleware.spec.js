describe("middleware", function () {

   const cacheable = require('../src/middleware');
   const now = new Date(2018, 0, 1, 0, 0, 0, 0);

   let clock;
   let mockRequest, mockResponse;

   beforeEach(() => {
      clock = jasmine.clock();
      clock.mockDate(new Date(2018, 0, 1, 0, 0, 0, 0));

      mockRequest = {};
      mockResponse = {
         headers: {},
         set (key, value) {
            mockResponse.headers[key] = value;
         }
      };
   });

   afterEach(() => {
      clock.uninstall();
   });

   it('creates a caching function when called', () => {
      expect(typeof cacheable).toBe('function');
      expect(typeof cacheable()).toBe('function');
      expect(typeof cacheable(200, 's')).toBe('function');

      expect(() => cacheable('foo')).toThrow();
   });

   it('sets cache headers', () => {
      const middleware = cacheable(5, 'hours');
      middleware(mockRequest, mockResponse, () => {
         const ms = 5 * 1000 * 60 * 60;

         expect(mockResponse.headers).toEqual({
            'Cache-Control': `max-age=${ ms / 1000 }`,
            'Expires': new Date(+now + ms).toUTCString(),
            'Last-Modified': now.toUTCString(),
         });
      });
   });

   it('sets no cache headers when not cached', () => {
      const middleware = cacheable();
      middleware(mockRequest, mockResponse, () => {
         expect(mockResponse.headers).toEqual({});
      });
   });

   it('adds per-response caching function', () => {
      const middleware = cacheable();
      const ms = 2 * 1000 * 60 * 60 * 24;

      middleware(mockRequest, mockResponse, () => {
         expect(typeof mockResponse.cacheFor).toBe('function');
         expect(mockResponse.headers).toEqual({});

         mockResponse.cacheFor(ms);

         expect(mockResponse.headers).toEqual({
            'Cache-Control': `max-age=${ ms / 1000 }`,
            'Expires': new Date(+now + ms).toUTCString(),
            'Last-Modified': now.toUTCString(),
         });
      });
   });

});
