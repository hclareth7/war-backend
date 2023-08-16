const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../../swagger_output.json')
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const asciiArt = `                                                                                                                
                                                                                                                
                                                                                                                
                                                        lllllll          tttt                                   
                                                        l:::::l       ttt:::t                                   
                                                        l:::::l       t:::::t                                   
                                                        l:::::l       t:::::t                                   
   qqqqqqqqq   qqqqquuuuuu    uuuuuu    aaaaaaaaaaaaa    l::::l ttttttt:::::ttttttt    yyyyyyy           yyyyyyy
  q:::::::::qqq::::qu::::u    u::::u    a::::::::::::a   l::::l t:::::::::::::::::t     y:::::y         y:::::y 
 q:::::::::::::::::qu::::u    u::::u    aaaaaaaaa:::::a  l::::l t:::::::::::::::::t      y:::::y       y:::::y  
q::::::qqqqq::::::qqu::::u    u::::u             a::::a  l::::l tttttt:::::::tttttt       y:::::y     y:::::y   
q:::::q     q:::::q u::::u    u::::u      aaaaaaa:::::a  l::::l       t:::::t              y:::::y   y:::::y    
q:::::q     q:::::q u::::u    u::::u    aa::::::::::::a  l::::l       t:::::t               y:::::y y:::::y     
q:::::q     q:::::q u::::u    u::::u   a::::aaaa::::::a  l::::l       t:::::t                y:::::y:::::y      
q::::::q    q:::::q u:::::uuuu:::::u  a::::a    a:::::a  l::::l       t:::::t    tttttt       y:::::::::y       
q:::::::qqqqq:::::q u:::::::::::::::uua::::a    a:::::a l::::::l      t::::::tttt:::::t        y:::::::y        
 q::::::::::::::::q  u:::::::::::::::ua:::::aaaa::::::a l::::::l      tt::::::::::::::t         y:::::y         
  qq::::::::::::::q   uu::::::::uu:::u a::::::::::aa:::al::::::l        tt:::::::::::tt        y:::::y          
    qqqqqqqq::::::q     uuuuuuuu  uuuu  aaaaaaaaaa  aaaallllllll          ttttttttttt         y:::::y           
            q:::::q                                                                          y:::::y            
            q:::::q                                                                         y:::::y             
           q:::::::q                                                                       y:::::y              
           q:::::::q                                                                      y:::::y               
           q:::::::q                                                                     yyyyyyy                
           qqqqqqqqq                                                                                            
                                                                                                                `;
  res.send(`
            <html>
            <head>
                <title>qualty</title>
            </head>
            <body style="margin: 0;display: flex;justify-content: center;align-items: center;background: rgb(34,193,195);background: linear-gradient(257deg, rgba(34,193,195,1) 0%, rgba(0,255,154,1) 100%);">
                <pre style="color: #b2fff8;text-align:center;">${asciiArt}</pre>
            </body>
            </html>
`);
});

router.get('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = router;
