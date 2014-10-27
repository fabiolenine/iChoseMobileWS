// app/routesMobileWS.js
module.exports = function(app, passport, mongoose, mobilewsDetalhes) {

    // ------------------------------------------------------------------------
    // set up Express routes to handle incoming requests
    //
    // roteamento do serviço web
    app.get('/api', function(req,res)
        {
            res.send('Olá Sam Bell, estou aqui para lhe ajudar!');
        });

}