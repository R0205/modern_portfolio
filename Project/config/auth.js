module.exports= {
    ensureAuthenticated:function(req, res, next){
        if(req.isAuthenticated()){
           return next();
// this code is for ensure that dashboard page is not showing without login
        }
        req.flash('error_msg', 'please log in to view resources');
        res.redirect('/users/login');
    }
}