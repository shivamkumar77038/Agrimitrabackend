import jwt  from 'jsonwebtoken';


//auth middleware
const Authmiddleware =(req,res,next)=>{
    
    const token = req.header('Authorization')?.replace('Bearer ', '');

 
    if(token){
          
        try{
            var decoded = jwt.verify(token,process.env.JWT_SECKRET_KEY);
         
            req.user = decoded;
          
            next();
          
        }catch(error){
            console.log("error from authMiddleware",error);
            return res.status(400).json({message:"invalid token"});
            
        }
         

    }else{
        return res.status(400).json({message:"invalid token "});
    }

  

}

// 



export {Authmiddleware};