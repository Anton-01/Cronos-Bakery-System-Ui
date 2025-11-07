import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

/**
 * HTTP Interceptor to show loading spinner during requests
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  // Don't show spinner for certain requests
  const skipLoading = req.headers.has('X-Skip-Loading');
  if (skipLoading) {
    return next(req.clone({ headers: req.headers.delete('X-Skip-Loading') }));
  }

  spinner.show();

  return next(req).pipe(
    finalize(() => {
      spinner.hide();
    })
  );
};
