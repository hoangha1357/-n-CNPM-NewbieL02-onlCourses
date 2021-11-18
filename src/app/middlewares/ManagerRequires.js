
module.exports = function managerRequires(req, res, next) {
    if (req.user.permission === 'Manager') {
      return next();
    } else {
      res.send('You do not have permission to access');
    }
}