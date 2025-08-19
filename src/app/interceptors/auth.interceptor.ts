import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem("token")
  if(req.method != "GET" ){
    const reqWithHeader = req.clone({
  headers: req.headers.set("Authorization",`Bearer ${token}`)
});
  return next(reqWithHeader);
  }
  return next(req);
};
