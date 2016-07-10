
export function handleError(err, req, res, next) {
  if (err) {
    if (err.code === 500 || err.code === null){
//      console.error('Error handling query: ' + req.path);
//      console.error(err.message);
    }
    res.statusMessage = err.message;
    if (err.body) {
      if (typeof err.body) res.status(err.code || 500).json(err.body);
      else res.status(err.code || 500).send(err.body);
    }
    else res.status(err.code || 500).end();
  }
  next();
}